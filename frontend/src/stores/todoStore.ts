import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Todo, CreateTodoInput, UpdateTodoInput, TodoStats } from '../types/todo'
import * as todoApi from '../api/todoApi'

export const useTodoStore = defineStore('todo', () => {
  // State
  const todos = ref<Todo[]>([])
  const stats = ref<TodoStats>({ total: 0, completed: 0, pending: 0, highPriority: 0 })
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const pendingTodos = computed(() => todos.value.filter((t) => !t.completed))
  const completedTodos = computed(() => todos.value.filter((t) => t.completed))
  const highPriorityTodos = computed(() => todos.value.filter((t) => t.priority === 'high' && !t.completed))

  const todosWithUpcomingReminders = computed(() => {
    const now = new Date()
    return todos.value.filter((t) => {
      if (!t.remindAt || t.completed) return false
      const remindTime = new Date(t.remindAt)
      return remindTime > now
    })
  })

  // Actions
  async function loadTodos(status?: 'completed' | 'pending') {
    loading.value = true
    error.value = null
    try {
      todos.value = await todoApi.fetchTodos(status)
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to load todos'
    } finally {
      loading.value = false
    }
  }

  async function loadStats() {
    try {
      stats.value = await todoApi.fetchTodoStats()
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to load stats'
    }
  }

  async function addTodo(input: CreateTodoInput) {
    loading.value = true
    error.value = null
    try {
      const newTodo = await todoApi.createTodo(input)
      todos.value.unshift(newTodo)
      await loadStats()
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to create todo'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function editTodo(id: number, input: UpdateTodoInput) {
    loading.value = true
    error.value = null
    try {
      const updated = await todoApi.updateTodo(id, input)
      const index = todos.value.findIndex((t) => t.id === id)
      if (index !== -1) {
        todos.value[index] = updated
      }
      await loadStats()
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to update todo'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function toggleComplete(id: number) {
    const todo = todos.value.find((t) => t.id === id)
    if (!todo) return
    await editTodo(id, { completed: !todo.completed })
  }

  async function removeTodo(id: number) {
    loading.value = true
    error.value = null
    try {
      await todoApi.deleteTodo(id)
      todos.value = todos.value.filter((t) => t.id !== id)
      await loadStats()
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to delete todo'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    todos,
    stats,
    loading,
    error,
    // Getters
    pendingTodos,
    completedTodos,
    highPriorityTodos,
    todosWithUpcomingReminders,
    // Actions
    loadTodos,
    loadStats,
    addTodo,
    editTodo,
    toggleComplete,
    removeTodo,
  }
})
