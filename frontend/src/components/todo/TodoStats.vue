<script setup lang="ts">
import type { TodoStats } from '../../types/todo'

defineProps<{
  stats: TodoStats
}>()

const cards = [
  { key: 'total', label: 'Total Tasks', icon: '📋', colorVar: '--info' },
  { key: 'pending', label: 'Pending', icon: '⏳', colorVar: '--warning' },
  { key: 'completed', label: 'Completed', icon: '✅', colorVar: '--success' },
  { key: 'highPriority', label: 'High Priority', icon: '🔥', colorVar: '--danger' },
]
</script>

<template>
  <div class="stats-grid">
    <div
      v-for="(card, index) in cards"
      :key="card.key"
      class="stat-card glass-card stagger-item"
      :style="{ '--card-accent': `var(${card.colorVar})`, animationDelay: `${index * 0.08}s` }"
    >
      <div class="stat-card-header">
        <span class="stat-card-icon">{{ card.icon }}</span>
        <span class="stat-card-label">{{ card.label }}</span>
      </div>
      <div class="stat-card-value">{{ stats[card.key as keyof TodoStats] }}</div>
      <div class="stat-card-accent-line" />
    </div>
  </div>
</template>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-lg);
}

.stat-card {
  padding: var(--space-lg);
  position: relative;
  overflow: hidden;
}

.stat-card-header {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
}

.stat-card-icon {
  font-size: 1.3rem;
}

.stat-card-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-card-value {
  font-family: var(--font-display);
  font-size: 2.4rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
}

.stat-card-accent-line {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--card-accent), transparent);
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
}
</style>
