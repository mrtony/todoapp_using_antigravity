import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTodoStore } from '../stores/todoStore'

// Mock the API module
vi.mock('../api/todoApi', () => ({
  fetchTodos: vi.fn().mockResolvedValue([
    { id: 1, title: 'Test 1', content: '', priority: 'medium', completed: false, remindAt: null, createdAt: '2026-03-05', updatedAt: '2026-03-05' },
    { id: 2, title: 'Test 2', content: 'desc', priority: 'high', completed: true, remindAt: null, createdAt: '2026-03-05', updatedAt: '2026-03-05' },
  ]),
  fetchTodoStats: vi.fn().mockResolvedValue({ total: 2, completed: 1, pending: 1, highPriority: 0 }),
  createTodo: vi.fn().mockResolvedValue({
    id: 3, title: 'New Todo', content: '', priority: 'medium', completed: false, remindAt: null, createdAt: '2026-03-05', updatedAt: '2026-03-05',
  }),
  updateTodo: vi.fn().mockResolvedValue({
    id: 1, title: 'Updated', content: '', priority: 'high', completed: false, remindAt: null, createdAt: '2026-03-05', updatedAt: '2026-03-05',
  }),
  deleteTodo: vi.fn().mockResolvedValue(undefined),
}))

describe('Todo Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should have initial state', () => {
    const store = useTodoStore()
    expect(store.todos).toEqual([])
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
    expect(store.stats.total).toBe(0)
  })

  it('should load todos', async () => {
    const store = useTodoStore()
    await store.loadTodos()

    expect(store.todos.length).toBe(2)
    expect(store.todos[0].title).toBe('Test 1')
  })

  it('should load stats', async () => {
    const store = useTodoStore()
    await store.loadStats()

    expect(store.stats.total).toBe(2)
    expect(store.stats.completed).toBe(1)
    expect(store.stats.pending).toBe(1)
  })

  it('should compute pending todos', async () => {
    const store = useTodoStore()
    await store.loadTodos()

    expect(store.pendingTodos.length).toBe(1)
    expect(store.pendingTodos[0].title).toBe('Test 1')
  })

  it('should compute completed todos', async () => {
    const store = useTodoStore()
    await store.loadTodos()

    expect(store.completedTodos.length).toBe(1)
    expect(store.completedTodos[0].title).toBe('Test 2')
  })

  it('should add a todo', async () => {
    const store = useTodoStore()
    await store.addTodo({ title: 'New Todo' })

    expect(store.todos.length).toBe(1)
    expect(store.todos[0].title).toBe('New Todo')
  })

  it('should remove a todo', async () => {
    const store = useTodoStore()
    await store.loadTodos()
    await store.removeTodo(1)

    expect(store.todos.length).toBe(1)
    expect(store.todos[0].id).toBe(2)
  })
})
