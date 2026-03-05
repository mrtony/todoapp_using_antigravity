# Smart Todo — Architecture & Implementation Plan

A SaaS-style Todo application with a **Vue 3 frontend** and **Node.js + Express backend**, two independent projects communicating via REST API.

---

## Tech Stack Summary

| Layer | Technology |
|---|---|
| Frontend Framework | Vue 3 + Composition API + `<script setup lang="ts">` |
| Build Tool | Vite |
| State Management | Pinia |
| Routing | Vue Router v4 (HTML5 history mode) |
| HTTP Client | Axios |
| UI Library | Element Plus (full import) |
| Backend | Node.js + Express |
| Database | SQLite via `better-sqlite3` |
| Unit Testing | Vitest |
| E2E Testing | Playwright (Chromium) |
| Package Manager | npm |

---

## Project Structure

```
todo_app_using_antigravity/
├── frontend/                    # Vue 3 SPA
│   ├── public/
│   ├── src/
│   │   ├── api/                 # Axios service layer
│   │   │   └── todoApi.ts
│   │   ├── assets/
│   │   │   └── styles/
│   │   │       └── main.css     # Global design tokens & reset
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── AppLayout.vue
│   │   │   │   ├── AppSidebar.vue
│   │   │   │   └── AppHeader.vue
│   │   │   └── todo/
│   │   │       ├── TodoForm.vue       # Add / Edit form (dialog)
│   │   │       ├── TodoList.vue       # Table / card list
│   │   │       ├── TodoItem.vue       # Single todo row/card
│   │   │       └── TodoStats.vue      # Dashboard stat cards
│   │   ├── composables/
│   │   │   ├── useTodoReminder.ts     # Timer-based reminder
│   │   │   └── useNotification.ts     # Wrapper around ElNotification
│   │   ├── router/
│   │   │   └── index.ts
│   │   ├── stores/
│   │   │   └── todoStore.ts
│   │   ├── types/
│   │   │   └── todo.ts
│   │   ├── views/
│   │   │   ├── DashboardView.vue
│   │   │   └── TodosView.vue
│   │   ├── App.vue
│   │   └── main.ts
│   ├── e2e/                      # Playwright E2E tests
│   │   └── todo.spec.ts
│   ├── src/__tests__/            # Vitest unit tests
│   │   ├── todoStore.spec.ts
│   │   ├── TodoForm.spec.ts
│   │   ├── TodoList.spec.ts
│   │   └── TodoStats.spec.ts
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── playwright.config.ts
│   └── package.json
│
└── backend/                     # Express REST API
    ├── src/
    │   ├── db/
    │   │   ├── database.ts      # SQLite connection & init
    │   │   └── migrations.ts    # Table creation
    │   ├── routes/
    │   │   └── todoRoutes.ts
    │   ├── middleware/
    │   │   └── errorHandler.ts
    │   ├── types/
    │   │   └── todo.ts
    │   └── index.ts             # Express entry point
    ├── __tests__/
    │   └── todoRoutes.spec.ts
    ├── tsconfig.json
    ├── vitest.config.ts
    └── package.json
```

---

## Database Schema

```sql
CREATE TABLE IF NOT EXISTS todos (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT    NOT NULL,
  content     TEXT    DEFAULT '',
  priority    TEXT    CHECK(priority IN ('low','medium','high')) DEFAULT 'medium',
  completed   INTEGER DEFAULT 0,          -- 0 = false, 1 = true
  remind_at   TEXT    DEFAULT NULL,        -- ISO 8601 datetime string
  created_at  TEXT    DEFAULT (datetime('now')),
  updated_at  TEXT    DEFAULT (datetime('now'))
);
```

---

## Backend REST API

Base URL: `http://localhost:3001/api`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/todos` | List all todos (supports `?status=completed\|pending`) |
| `GET` | `/todos/:id` | Get a single todo |
| `POST` | `/todos` | Create a new todo |
| `PUT` | `/todos/:id` | Update a todo |
| `DELETE` | `/todos/:id` | Delete a todo |
| `GET` | `/todos/stats` | Get aggregate stats (total, completed, pending) |

### Response Shape

```jsonc
// Single todo
{
  "id": 1,
  "title": "Buy groceries",
  "content": "Milk, eggs, bread",
  "priority": "high",
  "completed": false,
  "remindAt": "2026-03-06T10:00:00+08:00",
  "createdAt": "2026-03-05T22:00:00+08:00",
  "updatedAt": "2026-03-05T22:00:00+08:00"
}
```

---

## Frontend Routes

| Path | View | Description |
|---|---|---|
| `/` | `DashboardView` | Dashboard with stats cards |
| `/todos` | `TodosView` | Full todo management (CRUD) |

---

## Component Map

### Layout Components
- **`AppLayout.vue`** — Composition surface: sidebar + header + `<RouterView>`. No business logic.
- **`AppSidebar.vue`** — Navigation menu using `ElMenu`. Props: none. Emits: none (uses `<RouterLink>`).
- **`AppHeader.vue`** — App title, branding bar.

### Todo Feature Components
- **`TodoStats.vue`** — Displays stat cards (total, completed, pending, high-priority). Props: `stats: TodoStats`. Emits: none.
- **`TodoList.vue`** — Renders the todo table/list with actions. Props: `todos: Todo[]`. Emits: `edit(todo)`, `delete(id)`, `toggleComplete(id)`.
- **`TodoItem.vue`** — Single todo row inside `TodoList`. Props: `todo: Todo`. Emits: `edit`, `delete`, `toggleComplete`.
- **`TodoForm.vue`** — Add/edit dialog with title, content, priority selector, and datetime picker. Props: `modelValue: boolean` (dialog visibility), `todo?: Todo`. Emits: `update:modelValue`, `submit(todoData)`.

### Composables
- **`useTodoReminder`** — Polls pending reminders from the store, fires `ElNotification` when `remindAt` <= now.
- **`useNotification`** — Thin wrapper around `ElNotification` for consistent styling.

---

## Design Direction (frontend-design skill)

**Aesthetic**: **Refined dark SaaS** — deep charcoal backgrounds with electric teal/cyan accents. Clean geometric precision, generous whitespace, and subtle glassmorphic cards.

- **Typography**: Google Fonts — `DM Sans` (headings) + `IBM Plex Sans` (body). No generic defaults.
- **Color Palette**: CSS custom properties:
  - `--bg-primary: #0f1117` (deep dark), `--bg-surface: #1a1d27` (card surface)
  - `--accent: #00d4aa` (teal), `--accent-hover: #00f0c0`
  - `--text-primary: #e8eaed`, `--text-secondary: #8b8fa3`
  - `--danger: #ff5c72`, `--warning: #ffb347`, `--success: #00d4aa`
- **Motion**: Staggered card reveals on page load, hover-lift on cards, smooth route transitions via Vue `<Transition>`.
- **Layout**: Fixed left sidebar (collapsed on mobile) + scrollable main content area.

---

## Proposed Changes

### Backend

#### [NEW] [package.json](file:///home/tony/labs/todo_app_using_antigravity/backend/package.json)
NPM project with Express, `better-sqlite3`, TypeScript, CORS, Vitest.

#### [NEW] [tsconfig.json](file:///home/tony/labs/todo_app_using_antigravity/backend/tsconfig.json)
TypeScript config targeting ES2020, Node module resolution.

#### [NEW] [vitest.config.ts](file:///home/tony/labs/todo_app_using_antigravity/backend/vitest.config.ts)
Vitest config for backend tests.

#### [NEW] [src/index.ts](file:///home/tony/labs/todo_app_using_antigravity/backend/src/index.ts)
Express entry point — JSON middleware, CORS, mount routes, global error handler, listen on port 3001.

#### [NEW] [src/db/database.ts](file:///home/tony/labs/todo_app_using_antigravity/backend/src/db/database.ts)
SQLite connection singleton using `better-sqlite3`.

#### [NEW] [src/db/migrations.ts](file:///home/tony/labs/todo_app_using_antigravity/backend/src/db/migrations.ts)
Table creation for `todos`.

#### [NEW] [src/routes/todoRoutes.ts](file:///home/tony/labs/todo_app_using_antigravity/backend/src/routes/todoRoutes.ts)
RESTful routes for CRUD + stats.

#### [NEW] [src/middleware/errorHandler.ts](file:///home/tony/labs/todo_app_using_antigravity/backend/src/middleware/errorHandler.ts)
Global Express error-handling middleware.

#### [NEW] [src/types/todo.ts](file:///home/tony/labs/todo_app_using_antigravity/backend/src/types/todo.ts)
TypeScript interfaces for Todo.

#### [NEW] [__tests__/todoRoutes.spec.ts](file:///home/tony/labs/todo_app_using_antigravity/backend/__tests__/todoRoutes.spec.ts)
Vitest unit tests covering all CRUD endpoints and stats.

---

### Frontend

#### [NEW] [package.json](file:///home/tony/labs/todo_app_using_antigravity/frontend/package.json)
Vite + Vue 3 + TypeScript project with Element Plus, Pinia, Vue Router, Axios, Vitest, Playwright.

#### [NEW] [vite.config.ts](file:///home/tony/labs/todo_app_using_antigravity/frontend/vite.config.ts)
Vite config with Vue plugin, proxy `/api` to `http://localhost:3001`.

#### [NEW] [src/main.ts](file:///home/tony/labs/todo_app_using_antigravity/frontend/src/main.ts)
App entry — install Element Plus, Pinia, Vue Router.

#### [NEW] [src/App.vue](file:///home/tony/labs/todo_app_using_antigravity/frontend/src/App.vue)
Root component wrapping `<AppLayout>`.

#### [NEW] [src/assets/styles/main.css](file:///home/tony/labs/todo_app_using_antigravity/frontend/src/assets/styles/main.css)
Design tokens, CSS reset, typography, dark theme variables.

#### [NEW] [src/types/todo.ts](file:///home/tony/labs/todo_app_using_antigravity/frontend/src/types/todo.ts)
Shared TypeScript interfaces.

#### [NEW] [src/api/todoApi.ts](file:///home/tony/labs/todo_app_using_antigravity/frontend/src/api/todoApi.ts)
Axios instance + typed CRUD functions.

#### [NEW] [src/stores/todoStore.ts](file:///home/tony/labs/todo_app_using_antigravity/frontend/src/stores/todoStore.ts)
Pinia store with state, getters (stats, filtered), and actions (CRUD).

#### [NEW] [src/router/index.ts](file:///home/tony/labs/todo_app_using_antigravity/frontend/src/router/index.ts)
Vue Router v4 with Dashboard and Todos routes.

#### [NEW] Layout components
`AppLayout.vue`, `AppSidebar.vue`, `AppHeader.vue`

#### [NEW] Todo feature components
`TodoStats.vue`, `TodoList.vue`, `TodoItem.vue`, `TodoForm.vue`

#### [NEW] Composables
`useTodoReminder.ts`, `useNotification.ts`

#### [NEW] Views
`DashboardView.vue`, `TodosView.vue`

#### [NEW] Unit tests
`src/__tests__/todoStore.spec.ts`, `TodoForm.spec.ts`, `TodoList.spec.ts`, `TodoStats.spec.ts`

#### [NEW] E2E tests
`e2e/todo.spec.ts` — full flow: create, edit, complete, delete a todo.

---

## Verification Plan

### Automated Tests

**Backend unit tests (Vitest):**
```bash
cd backend && npx vitest run
```
- Tests CRUD operations against an in-memory SQLite database.
- Tests API response shapes and status codes.
- Tests input validation and error responses.

**Frontend unit tests (Vitest):**
```bash
cd frontend && npx vitest run
```
- Tests Pinia store actions and getters.
- Tests component rendering and user interactions via `@vue/test-utils`.

**E2E tests (Playwright + Chromium):**
```bash
cd frontend && npx playwright test --project=chromium
```
- Full user flow: navigate to todos page → create a todo → verify it appears → edit → mark complete → delete → verify dashboard stats update.

### Manual Verification
1. Start backend: `cd backend && npm run dev` → Confirm server runs on port 3001.
2. Start frontend: `cd frontend && npm run dev` → Open in browser.
3. Verify Dashboard shows stats cards (initially all zeros).
4. Navigate to Todos → Create a new todo with title, content, priority, and reminder.
5. Verify the todo appears in the list.
6. Edit the todo, toggle completion, delete it.
7. Return to Dashboard, verify stats update.
