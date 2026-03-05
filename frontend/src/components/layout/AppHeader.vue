<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const pageTitle = computed(() => {
  return (route.meta.title as string) || 'Smart Todo'
})

const now = new Date()
const greeting = computed(() => {
  const hour = now.getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
})
</script>

<template>
  <header class="app-header">
    <div class="app-header-left">
      <h1 class="app-header-title">{{ pageTitle }}</h1>
      <span class="app-header-greeting">{{ greeting }} 👋</span>
    </div>
    <div class="app-header-right">
      <div class="app-header-date">
        {{ now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) }}
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-lg) var(--space-xl);
  border-bottom: 1px solid var(--border-subtle);
  background: var(--bg-surface);
}

.app-header-left {
  display: flex;
  align-items: baseline;
  gap: var(--space-md);
}

.app-header-title {
  font-size: 1.4rem;
  font-weight: 700;
}

.app-header-greeting {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.app-header-date {
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-weight: 500;
}
</style>
