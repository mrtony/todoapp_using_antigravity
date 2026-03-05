import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import type Database from 'better-sqlite3'
import type { TodoRow, CreateTodoInput, UpdateTodoInput, Todo, TodoStats } from '../types/todo.js'

function rowToTodo(row: TodoRow): Todo {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    priority: row.priority as Todo['priority'],
    completed: row.completed === 1,
    remindAt: row.remind_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function createTodoRoutes(db: Database.Database): Router {
  const router = Router()

  // GET /api/todos/stats — must be before /:id
  router.get('/stats', (_req: Request, res: Response) => {
    const total = (db.prepare('SELECT COUNT(*) as count FROM todos').get() as { count: number }).count
    const completed = (db.prepare('SELECT COUNT(*) as count FROM todos WHERE completed = 1').get() as { count: number }).count
    const highPriority = (db.prepare("SELECT COUNT(*) as count FROM todos WHERE priority = 'high' AND completed = 0").get() as { count: number }).count

    const stats: TodoStats = {
      total,
      completed,
      pending: total - completed,
      highPriority,
    }
    res.json(stats)
  })

  // GET /api/todos
  router.get('/', (req: Request, res: Response) => {
    const { status } = req.query
    let rows: TodoRow[]

    if (status === 'completed') {
      rows = db.prepare('SELECT * FROM todos WHERE completed = 1 ORDER BY updated_at DESC').all() as TodoRow[]
    } else if (status === 'pending') {
      rows = db.prepare('SELECT * FROM todos WHERE completed = 0 ORDER BY updated_at DESC').all() as TodoRow[]
    } else {
      rows = db.prepare('SELECT * FROM todos ORDER BY updated_at DESC').all() as TodoRow[]
    }

    res.json(rows.map(rowToTodo))
  })

  // GET /api/todos/:id
  router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
    const row = db.prepare('SELECT * FROM todos WHERE id = ?').get(req.params.id) as TodoRow | undefined
    if (!row) {
      const err = new Error('Todo not found') as Error & { status?: number }
      err.status = 404
      return next(err)
    }
    res.json(rowToTodo(row))
  })

  // POST /api/todos
  router.post('/', (req: Request, res: Response, next: NextFunction) => {
    const { title, content, priority, remindAt } = req.body as CreateTodoInput

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      const err = new Error('Title is required') as Error & { status?: number }
      err.status = 400
      return next(err)
    }

    const validPriorities = ['low', 'medium', 'high']
    const safePriority = priority && validPriorities.includes(priority) ? priority : 'medium'

    const result = db.prepare(
      'INSERT INTO todos (title, content, priority, remind_at) VALUES (?, ?, ?, ?)'
    ).run(title.trim(), content || '', safePriority, remindAt || null)

    const row = db.prepare('SELECT * FROM todos WHERE id = ?').get(result.lastInsertRowid) as TodoRow
    res.status(201).json(rowToTodo(row))
  })

  // PUT /api/todos/:id
  router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
    const existing = db.prepare('SELECT * FROM todos WHERE id = ?').get(req.params.id) as TodoRow | undefined
    if (!existing) {
      const err = new Error('Todo not found') as Error & { status?: number }
      err.status = 404
      return next(err)
    }

    const { title, content, priority, completed, remindAt } = req.body as UpdateTodoInput

    const validPriorities = ['low', 'medium', 'high']
    const newTitle = title !== undefined ? title.trim() : existing.title
    const newContent = content !== undefined ? content : existing.content
    const newPriority = priority && validPriorities.includes(priority) ? priority : existing.priority
    const newCompleted = completed !== undefined ? (completed ? 1 : 0) : existing.completed
    const newRemindAt = remindAt !== undefined ? remindAt : existing.remind_at

    if (!newTitle || newTitle.length === 0) {
      const err = new Error('Title cannot be empty') as Error & { status?: number }
      err.status = 400
      return next(err)
    }

    db.prepare(
      `UPDATE todos SET title = ?, content = ?, priority = ?, completed = ?, remind_at = ?, updated_at = datetime('now') WHERE id = ?`
    ).run(newTitle, newContent, newPriority, newCompleted, newRemindAt, req.params.id)

    const row = db.prepare('SELECT * FROM todos WHERE id = ?').get(req.params.id) as TodoRow
    res.json(rowToTodo(row))
  })

  // DELETE /api/todos/:id
  router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
    const existing = db.prepare('SELECT * FROM todos WHERE id = ?').get(req.params.id) as TodoRow | undefined
    if (!existing) {
      const err = new Error('Todo not found') as Error & { status?: number }
      err.status = 404
      return next(err)
    }

    db.prepare('DELETE FROM todos WHERE id = ?').run(req.params.id)
    res.status(204).send()
  })

  return router
}
