import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import Database from 'better-sqlite3'
import express from 'express'
import { createTodoRoutes } from '../src/routes/todoRoutes.js'
import { runMigrations } from '../src/db/migrations.js'
import { errorHandler } from '../src/middleware/errorHandler.js'

function createTestApp() {
  const db = new Database(':memory:')
  db.pragma('journal_mode = WAL')
  runMigrations(db)

  const app = express()
  app.use(express.json())
  app.use('/api/todos', createTodoRoutes(db))
  app.use(errorHandler)

  return { app, db }
}

// Simple request helper using native fetch-like approach
async function request(app: express.Express, method: string, url: string, body?: unknown) {
  return new Promise<{ status: number; body: unknown }>((resolve) => {
    const server = app.listen(0, () => {
      const addr = server.address()
      if (!addr || typeof addr === 'string') {
        server.close()
        return
      }
      const port = addr.port
      const options: RequestInit = {
        method,
        headers: { 'Content-Type': 'application/json' },
      }
      if (body) options.body = JSON.stringify(body)

      fetch(`http://localhost:${port}${url}`, options)
        .then(async (res) => {
          let responseBody: unknown = null
          const text = await res.text()
          if (text) {
            try { responseBody = JSON.parse(text) } catch { responseBody = text }
          }
          resolve({ status: res.status, body: responseBody })
          server.close()
        })
        .catch(() => {
          server.close()
        })
    })
  })
}

describe('Todo API Routes', () => {
  let app: express.Express
  let db: Database.Database

  beforeEach(() => {
    const testSetup = createTestApp()
    app = testSetup.app
    db = testSetup.db
  })

  afterEach(() => {
    db.close()
  })

  describe('POST /api/todos', () => {
    it('should create a new todo', async () => {
      const res = await request(app, 'POST', '/api/todos', {
        title: 'Test Todo',
        content: 'Test content',
        priority: 'high',
      })

      expect(res.status).toBe(201)
      const todo = res.body as Record<string, unknown>
      expect(todo.title).toBe('Test Todo')
      expect(todo.content).toBe('Test content')
      expect(todo.priority).toBe('high')
      expect(todo.completed).toBe(false)
      expect(todo.id).toBeDefined()
    })

    it('should return 400 when title is missing', async () => {
      const res = await request(app, 'POST', '/api/todos', {
        content: 'No title',
      })

      expect(res.status).toBe(400)
    })

    it('should default priority to medium', async () => {
      const res = await request(app, 'POST', '/api/todos', {
        title: 'Default priority',
      })

      const todo = res.body as Record<string, unknown>
      expect(todo.priority).toBe('medium')
    })
  })

  describe('GET /api/todos', () => {
    it('should return all todos', async () => {
      await request(app, 'POST', '/api/todos', { title: 'Todo 1' })
      await request(app, 'POST', '/api/todos', { title: 'Todo 2' })

      const res = await request(app, 'GET', '/api/todos')
      expect(res.status).toBe(200)
      expect(Array.isArray(res.body)).toBe(true)
      expect((res.body as unknown[]).length).toBe(2)
    })

    it('should filter by status=completed', async () => {
      await request(app, 'POST', '/api/todos', { title: 'Todo 1' })
      const res2 = await request(app, 'POST', '/api/todos', { title: 'Todo 2' })
      const todo2 = res2.body as Record<string, unknown>
      await request(app, 'PUT', `/api/todos/${todo2.id}`, { completed: true })

      const res = await request(app, 'GET', '/api/todos?status=completed')
      expect((res.body as unknown[]).length).toBe(1)
    })

    it('should filter by status=pending', async () => {
      await request(app, 'POST', '/api/todos', { title: 'Todo 1' })
      const res2 = await request(app, 'POST', '/api/todos', { title: 'Todo 2' })
      const todo2 = res2.body as Record<string, unknown>
      await request(app, 'PUT', `/api/todos/${todo2.id}`, { completed: true })

      const res = await request(app, 'GET', '/api/todos?status=pending')
      expect((res.body as unknown[]).length).toBe(1)
    })
  })

  describe('GET /api/todos/:id', () => {
    it('should return a single todo', async () => {
      const createRes = await request(app, 'POST', '/api/todos', { title: 'Find me' })
      const created = createRes.body as Record<string, unknown>

      const res = await request(app, 'GET', `/api/todos/${created.id}`)
      expect(res.status).toBe(200)
      expect((res.body as Record<string, unknown>).title).toBe('Find me')
    })

    it('should return 404 for non-existent id', async () => {
      const res = await request(app, 'GET', '/api/todos/9999')
      expect(res.status).toBe(404)
    })
  })

  describe('PUT /api/todos/:id', () => {
    it('should update a todo', async () => {
      const createRes = await request(app, 'POST', '/api/todos', { title: 'Original' })
      const created = createRes.body as Record<string, unknown>

      const res = await request(app, 'PUT', `/api/todos/${created.id}`, {
        title: 'Updated',
        priority: 'low',
        completed: true,
      })

      expect(res.status).toBe(200)
      const todo = res.body as Record<string, unknown>
      expect(todo.title).toBe('Updated')
      expect(todo.priority).toBe('low')
      expect(todo.completed).toBe(true)
    })

    it('should return 404 for non-existent id', async () => {
      const res = await request(app, 'PUT', '/api/todos/9999', { title: 'Nope' })
      expect(res.status).toBe(404)
    })
  })

  describe('DELETE /api/todos/:id', () => {
    it('should delete a todo', async () => {
      const createRes = await request(app, 'POST', '/api/todos', { title: 'Delete me' })
      const created = createRes.body as Record<string, unknown>

      const res = await request(app, 'DELETE', `/api/todos/${created.id}`)
      expect(res.status).toBe(204)

      const getRes = await request(app, 'GET', `/api/todos/${created.id}`)
      expect(getRes.status).toBe(404)
    })

    it('should return 404 for non-existent id', async () => {
      const res = await request(app, 'DELETE', '/api/todos/9999')
      expect(res.status).toBe(404)
    })
  })

  describe('GET /api/todos/stats', () => {
    it('should return correct stats', async () => {
      await request(app, 'POST', '/api/todos', { title: 'T1', priority: 'high' })
      await request(app, 'POST', '/api/todos', { title: 'T2', priority: 'low' })
      const res3 = await request(app, 'POST', '/api/todos', { title: 'T3', priority: 'high' })
      const t3 = res3.body as Record<string, unknown>
      await request(app, 'PUT', `/api/todos/${t3.id}`, { completed: true })

      const res = await request(app, 'GET', '/api/todos/stats')
      expect(res.status).toBe(200)
      const stats = res.body as Record<string, number>
      expect(stats.total).toBe(3)
      expect(stats.completed).toBe(1)
      expect(stats.pending).toBe(2)
      expect(stats.highPriority).toBe(1) // only non-completed high-priority
    })
  })
})
