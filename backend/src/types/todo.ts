export interface Todo {
  id: number
  title: string
  content: string
  priority: 'low' | 'medium' | 'high'
  completed: boolean
  remindAt: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateTodoInput {
  title: string
  content?: string
  priority?: 'low' | 'medium' | 'high'
  remindAt?: string | null
}

export interface UpdateTodoInput {
  title?: string
  content?: string
  priority?: 'low' | 'medium' | 'high'
  completed?: boolean
  remindAt?: string | null
}

export interface TodoStats {
  total: number
  completed: number
  pending: number
  highPriority: number
}

export interface TodoRow {
  id: number
  title: string
  content: string
  priority: string
  completed: number
  remind_at: string | null
  created_at: string
  updated_at: string
}
