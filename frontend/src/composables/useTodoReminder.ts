import { watch, onUnmounted } from 'vue'
import { ElNotification } from 'element-plus'
import { useTodoStore } from '../stores/todoStore'

export function useTodoReminder() {
  const todoStore = useTodoStore()

  const notifiedIds = new Set<number>()

  function checkReminders() {
    const now = new Date()
    for (const todo of todoStore.todos) {
      if (!todo.remindAt || todo.completed || notifiedIds.has(todo.id)) continue

      const remindTime = new Date(todo.remindAt)
      if (remindTime <= now) {
        notifiedIds.add(todo.id)
        ElNotification({
          title: '⏰ Reminder',
          message: todo.title,
          type: 'warning',
          duration: 8000,
          position: 'top-right',
        })
      }
    }
  }

  // Check every 30 seconds
  const intervalId = setInterval(checkReminders, 30000)

  // Also check whenever todos change
  const stopWatch = watch(() => todoStore.todos, checkReminders, { deep: true })

  // Initial check
  checkReminders()

  onUnmounted(() => {
    clearInterval(intervalId)
    stopWatch()
  })

  return { checkReminders }
}
