import axios from 'axios'
import type { Todo, CreateTodoInput, UpdateTodoInput, TodoStats } from '../types/todo'

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export async function fetchTodos(status?: 'completed' | 'pending'): Promise<Todo[]> {
  const params = status ? { status } : {}
  const { data } = await apiClient.get<Todo[]>('/todos', { params })
  return data
}

export async function fetchTodoById(id: number): Promise<Todo> {
  const { data } = await apiClient.get<Todo>(`/todos/${id}`)
  return data
}

export async function fetchTodoStats(): Promise<TodoStats> {
  const { data } = await apiClient.get<TodoStats>('/todos/stats')
  return data
}

export async function createTodo(input: CreateTodoInput): Promise<Todo> {
  const { data } = await apiClient.post<Todo>('/todos', input)
  return data
}

export async function updateTodo(id: number, input: UpdateTodoInput): Promise<Todo> {
  const { data } = await apiClient.put<Todo>(`/todos/${id}`, input)
  return data
}

export async function deleteTodo(id: number): Promise<void> {
  await apiClient.delete(`/todos/${id}`)
}
