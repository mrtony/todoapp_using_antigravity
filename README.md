# Smart Todo App 📝

> [!NOTE]
> 這是一個基於現代前端與後端技術棧構建的智能待辦事項應用程式，旨在提供高效、流暢的任務管理體驗。

本專案分為兩個主要部分：使用 Vue 3 構建的前端應用，以及使用 Node.js 與 Express 構建的後端 API。

## 🌟 核心特色 (Features)

- **現代化前端架構**：採用 Vue 3 (Composition API)、Vite、Pinia 狀態管理與 Vue Router。
- **優雅的使用者介面**：整合 Element Plus 元件庫與預設客製化樣式。
- **穩健的後端系統**：基於 Node.js 與 Express.js 的 RESTful API。
- **輕量級資料庫**：使用 SQLite (better-sqlite3) 進行資料持久化儲存。
- **全端 TypeScript 支持**：確保程式碼的型別安全與開發體驗。
- **完善的測試覆蓋**：前端包含 Vitest 單元測試與 Playwright 端到端測試；後端包含 Vitest API 測試。

## 📋 系統需求 (Prerequisites)

在開始運行本專案之前，請確保您的開發環境已安裝以下組件：

- [Node.js](https://nodejs.org/) (建議 v18 或以上版本)
- npm (Node.js 隨附的套件管理工具)

## 📁 專案結構 (Project Structure)

本專案採用 Mono-repo 靈感的目錄結構，主要分為 `backend` (後端) 與 `frontend` (前端) 兩個獨立的部分：

```text
todo_app_using_antigravity/
├── backend/                  # Node.js + Express 後端 API
│   ├── src/
│   │   ├── db/               # SQLite 資料庫初始化與查詢邏輯
│   │   ├── middleware/       # Express 中介軟體 (如錯誤處理、日誌)
│   │   ├── routes/           # API 路由定義 (Todo 相關路由)
│   │   ├── types/            # TypeScript 型別定義
│   │   └── index.ts          # 後端伺服器入口文件
│   ├── data/                 # SQLite 資料庫文件 (.db, .db-shm, .db-wal)
│   ├── __tests__/            # API 單元與整合測試
│   └── package.json          # 後端依賴與腳本配置
│
└── frontend/                 # Vue 3 + Vite 前端應用
    ├── src/
    │   ├── api/              # Axios API 請求封裝 (與後端溝通)
    │   ├── assets/           # 靜態資源 (CSS, 圖片)
    │   ├── components/       # 可重用 Vue UI 元件 (如 TodoList, TodoItem)
    │   ├── composables/      # Vue 組合式 API (重用邏輯)
    │   ├── router/           # Vue Router 路由配置
    │   ├── stores/           # Pinia 狀態管理 (如 todoStore)
    │   ├── types/            # TypeScript 型別定義 (與後端對齊)
    │   ├── views/            # 頁面級別 Vue 元件 (如 HomeView)
    │   ├── App.vue           # 前端應用根元件
    │   └── main.ts           # 前端應用入口文件
    ├── public/               # 公共靜態文件
    ├── e2e/                  # Playwright 端到端 (E2E) 測試
    ├── __tests__/            # Vitest 元件單元測試
    └── package.json          # 前端依賴與腳本配置
```

## 🚀 快速開始 (Getting Started)

要運行這個專案，您需要分別啟動後端伺服器與前端開發伺服器。

### 1. 啟動後端 (Backend)

打開終端機，進入 `backend` 目錄並啟動伺服器：

```bash
cd backend
npm install
npm run dev

cd backend && npm run dev
```

> [!TIP]
> 後端 API 預設會運行在開發模式下，並使用 `tsx watch` 自動重載程式碼。

### 2. 啟動前端 (Frontend)

打開另一個終端機視窗，進入 `frontend` 目錄並啟動開發伺服器：

```bash
cd frontend
npm install
npm run dev

cd frontend && npm run dev
```

啟動成功後，終端機會顯示本地訪問網址（通常是 `http://localhost:5173`），請在瀏覽器中打開該網址以使用應用程式。

## 🛠️ 可用指令 (Available Scripts)

### 後端 (Backend)

- `npm run dev`: 在開發模式下啟動伺服器並啟用熱重載。
- `npm run build`: 將 TypeScript 編譯為 JavaScript。
- `npm start`: 運行編譯後的生產環境程式碼。
- `npm test`: 執行後端單元與整合測試。

### 前端 (Frontend)

- `npm run dev`: 啟動 Vite 開發伺服器。
- `npm run build`: 執行 TypeScript 型別檢查並構建生產版本。
- `npm run preview`: 在本地預覽生產環境構建物。
