import express from 'express'
import cors from 'cors'
import { getDatabase } from './db/database.js'
import { runMigrations } from './db/migrations.js'
import { createTodoRoutes } from './routes/todoRoutes.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Database setup
const db = getDatabase()
runMigrations(db)

// Routes
app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

app.use('/api/todos', createTodoRoutes(db))

// Error handling
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`🚀 Smart Todo API running on http://localhost:${PORT}`)
})

export default app
