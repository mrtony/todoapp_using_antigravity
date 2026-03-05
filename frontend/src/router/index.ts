import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { title: 'Dashboard' },
    },
    {
      path: '/todos',
      name: 'todos',
      component: () => import('../views/TodosView.vue'),
      meta: { title: 'Todos' },
    },
  ],
})

router.beforeEach((to) => {
  const title = (to.meta.title as string) || 'Smart Todo'
  document.title = `${title} | Smart Todo`
})

export default router
