<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const menuItems = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/todos', label: 'Todos', icon: '✅' },
]

const activePath = computed(() => route.path)
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-brand">
      <div class="sidebar-brand-icon">⚡</div>
      <span class="sidebar-brand-text">Smart Todo</span>
    </div>

    <nav class="sidebar-nav">
      <RouterLink
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        :class="['sidebar-nav-item', { 'sidebar-nav-item--active': activePath === item.path }]"
      >
        <span class="sidebar-nav-icon">{{ item.icon }}</span>
        <span class="sidebar-nav-label">{{ item.label }}</span>
      </RouterLink>
    </nav>

    <div class="sidebar-footer">
      <div class="sidebar-footer-text">Smart Todo v1.0</div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: var(--sidebar-width);
  background: var(--bg-surface);
  border-right: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  z-index: 100;
  transition: width var(--transition-normal);
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-lg) var(--space-lg);
  border-bottom: 1px solid var(--border-subtle);
}

.sidebar-brand-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, var(--accent), #00a88a);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  box-shadow: var(--accent-glow);
}

.sidebar-brand-text {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.sidebar-nav {
  flex: 1;
  padding: var(--space-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.sidebar-nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-weight: 500;
  font-size: 0.9rem;
  transition: all var(--transition-fast);
  text-decoration: none;
}

.sidebar-nav-item:hover {
  color: var(--text-primary);
  background: var(--bg-surface-hover);
}

.sidebar-nav-item--active {
  color: var(--accent) !important;
  background: var(--accent-dim);
}

.sidebar-nav-icon {
  font-size: 1.1rem;
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-footer {
  padding: var(--space-md) var(--space-lg);
  border-top: 1px solid var(--border-subtle);
}

.sidebar-footer-text {
  color: var(--text-muted);
  font-size: 0.75rem;
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }
}
</style>
