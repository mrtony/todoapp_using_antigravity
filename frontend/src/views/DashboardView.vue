<script setup lang="ts">
import { onMounted } from 'vue'
import { useTodoStore } from '../stores/todoStore'
import TodoStats from '../components/todo/TodoStats.vue'

const todoStore = useTodoStore()

onMounted(async () => {
  await todoStore.loadStats()
  await todoStore.loadTodos()
})
</script>

<template>
  <div class="dashboard">
    <section class="dashboard-section">
      <h2 class="dashboard-section-title">Overview</h2>
      <TodoStats :stats="todoStore.stats" />
    </section>

    <section class="dashboard-section">
      <h2 class="dashboard-section-title">Recent Tasks</h2>
      <div v-if="todoStore.todos.length === 0" class="dashboard-empty">
        <el-empty description="No tasks yet. Head to Todos to create your first!" :image-size="100">
          <RouterLink to="/todos">
            <el-button type="primary">Go to Todos</el-button>
          </RouterLink>
        </el-empty>
      </div>
      <div v-else class="dashboard-recent">
        <div
          v-for="(todo, index) in todoStore.todos.slice(0, 5)"
          :key="todo.id"
          class="dashboard-recent-item glass-card stagger-item"
          :style="{ animationDelay: `${0.3 + index * 0.08}s` }"
        >
          <div class="dashboard-recent-status">
            <span :class="['dashboard-dot', { 'dashboard-dot--done': todo.completed }]" />
          </div>
          <div class="dashboard-recent-body">
            <span :class="['dashboard-recent-title', { 'dashboard-recent-title--done': todo.completed }]">
              {{ todo.title }}
            </span>
            <el-tag
              :type="todo.priority === 'high' ? 'danger' : todo.priority === 'medium' ? 'warning' : 'info'"
              size="small"
              effect="dark"
            >
              {{ todo.priority }}
            </el-tag>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: var(--space-2xl);
}

.dashboard-section-title {
  margin-bottom: var(--space-lg);
  color: var(--text-primary);
  font-size: 1.15rem;
}

.dashboard-empty {
  padding: var(--space-2xl) 0;
}

.dashboard-recent {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.dashboard-recent-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md) var(--space-lg);
}

.dashboard-recent-status {
  flex-shrink: 0;
}

.dashboard-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--warning);
}

.dashboard-dot--done {
  background: var(--success);
}

.dashboard-recent-body {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex: 1;
}

.dashboard-recent-title {
  font-weight: 500;
  font-size: 0.9rem;
}

.dashboard-recent-title--done {
  text-decoration: line-through;
  color: var(--text-muted);
}
</style>
