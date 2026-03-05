<script setup lang="ts">
import { computed } from 'vue'
import type { Todo } from '../../types/todo'

const props = defineProps<{
  todo: Todo
}>()

const emit = defineEmits<{
  edit: [todo: Todo]
  delete: [id: number]
  toggleComplete: [id: number]
}>()

const priorityConfig = {
  high: { label: 'High', type: 'danger' as const },
  medium: { label: 'Medium', type: 'warning' as const },
  low: { label: 'Low', type: 'info' as const },
}

const priorityInfo = computed(() => priorityConfig[props.todo.priority])

const formattedRemindAt = computed(() => {
  if (!props.todo.remindAt) return null
  return new Date(props.todo.remindAt).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
})
</script>

<template>
  <div :class="['todo-item', { 'todo-item--completed': todo.completed }]">
    <div class="todo-item-check">
      <el-checkbox
        :model-value="todo.completed"
        @change="emit('toggleComplete', todo.id)"
        size="large"
      />
    </div>
    <div class="todo-item-body">
      <div class="todo-item-title">{{ todo.title }}</div>
      <div v-if="todo.content" class="todo-item-content">{{ todo.content }}</div>
      <div class="todo-item-meta">
        <el-tag :type="priorityInfo.type" size="small" effect="dark">
          {{ priorityInfo.label }}
        </el-tag>
        <span v-if="formattedRemindAt" class="todo-item-remind">
          🔔 {{ formattedRemindAt }}
        </span>
      </div>
    </div>
    <div class="todo-item-actions">
      <el-button
        type="primary"
        size="small"
        plain
        @click="emit('edit', todo)"
        :disabled="todo.completed"
      >
        Edit
      </el-button>
      <el-button
        type="danger"
        size="small"
        plain
        @click="emit('delete', todo.id)"
      >
        Delete
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.todo-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-md);
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  transition: all var(--transition-fast);
}

.todo-item:hover {
  background: var(--bg-surface-hover);
  border-color: var(--border-default);
}

.todo-item--completed {
  opacity: 0.55;
}

.todo-item--completed .todo-item-title {
  text-decoration: line-through;
  color: var(--text-muted);
}

.todo-item-check {
  padding-top: 2px;
}

.todo-item-body {
  flex: 1;
  min-width: 0;
}

.todo-item-title {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--text-primary);
  margin-bottom: var(--space-xs);
}

.todo-item-content {
  color: var(--text-secondary);
  font-size: 0.85rem;
  margin-bottom: var(--space-sm);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.todo-item-meta {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.todo-item-remind {
  color: var(--text-muted);
  font-size: 0.78rem;
}

.todo-item-actions {
  display: flex;
  gap: var(--space-xs);
  flex-shrink: 0;
}
</style>
