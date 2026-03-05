<script setup lang="ts">
import type { Todo } from '../../types/todo'
import TodoItem from './TodoItem.vue'

defineProps<{
  todos: Todo[]
  loading?: boolean
}>()

const emit = defineEmits<{
  edit: [todo: Todo]
  delete: [id: number]
  toggleComplete: [id: number]
}>()
</script>

<template>
  <div class="todo-list">
    <div v-if="loading" class="todo-list-loading">
      <el-skeleton :rows="3" animated />
    </div>

    <el-empty
      v-else-if="todos.length === 0"
      description="No todos yet. Create one to get started!"
      :image-size="120"
    />

    <TransitionGroup v-else name="list" tag="div" class="todo-list-items">
      <TodoItem
        v-for="todo in todos"
        :key="todo.id"
        :todo="todo"
        @edit="emit('edit', $event)"
        @delete="emit('delete', $event)"
        @toggle-complete="emit('toggleComplete', $event)"
      />
    </TransitionGroup>
  </div>
</template>

<style scoped>
.todo-list {
  display: flex;
  flex-direction: column;
}

.todo-list-loading {
  padding: var(--space-lg);
}

.todo-list-items {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

/* TransitionGroup animations */
.list-enter-active {
  transition: all 0.3s ease;
}

.list-leave-active {
  transition: all 0.25s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.list-move {
  transition: transform 0.3s ease;
}
</style>
