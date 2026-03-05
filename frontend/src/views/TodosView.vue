<script setup lang="ts">
import { onMounted, shallowRef } from 'vue'
import { useTodoStore } from '../stores/todoStore'
import { useNotification } from '../composables/useNotification'
import TodoList from '../components/todo/TodoList.vue'
import TodoForm from '../components/todo/TodoForm.vue'
import type { Todo, CreateTodoInput } from '../types/todo'

const todoStore = useTodoStore()
const { success, error } = useNotification()

const showForm = shallowRef(false)
const editingTodo = shallowRef<Todo | null>(null)

onMounted(() => {
  todoStore.loadTodos()
})

function handleAddNew() {
  editingTodo.value = null
  showForm.value = true
}

function handleEdit(todo: Todo) {
  editingTodo.value = todo
  showForm.value = true
}

async function handleSubmit(data: CreateTodoInput) {
  try {
    if (editingTodo.value) {
      await todoStore.editTodo(editingTodo.value.id, data)
      success('Todo updated successfully')
    } else {
      await todoStore.addTodo(data)
      success('Todo created successfully')
    }
    editingTodo.value = null
  } catch {
    error('Failed to save todo')
  }
}

async function handleDelete(id: number) {
  try {
    await todoStore.removeTodo(id)
    success('Todo deleted')
  } catch {
    error('Failed to delete todo')
  }
}

async function handleToggleComplete(id: number) {
  try {
    await todoStore.toggleComplete(id)
  } catch {
    error('Failed to update todo')
  }
}
</script>

<template>
  <div class="todos-view">
    <div class="todos-view-header">
      <h2 class="todos-view-title">
        All Todos
        <span class="todos-view-count">{{ todoStore.todos.length }}</span>
      </h2>
      <el-button type="primary" size="large" @click="handleAddNew" id="btn-add-todo">
        + New Todo
      </el-button>
    </div>

    <div class="todos-view-filters">
      <el-radio-group
        :model-value="'all'"
        @change="(val: string | number | boolean | undefined) => todoStore.loadTodos(val === 'all' ? undefined : val as 'completed' | 'pending')"
        size="default"
      >
        <el-radio-button value="all">All</el-radio-button>
        <el-radio-button value="pending">Pending</el-radio-button>
        <el-radio-button value="completed">Completed</el-radio-button>
      </el-radio-group>
    </div>

    <TodoList
      :todos="todoStore.todos"
      :loading="todoStore.loading"
      @edit="handleEdit"
      @delete="handleDelete"
      @toggle-complete="handleToggleComplete"
    />

    <TodoForm
      v-model="showForm"
      :todo="editingTodo"
      @submit="handleSubmit"
    />
  </div>
</template>

<style scoped>
.todos-view {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.todos-view-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.todos-view-title {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.todos-view-count {
  background: var(--accent-dim);
  color: var(--accent);
  padding: 2px 10px;
  border-radius: var(--radius-xl);
  font-size: 0.8rem;
  font-weight: 600;
}

.todos-view-filters {
  display: flex;
  gap: var(--space-sm);
}
</style>
