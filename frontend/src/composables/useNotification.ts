import { ElNotification } from 'element-plus'

type NotificationType = 'success' | 'warning' | 'error' | 'info'

export function useNotification() {
  function notify(title: string, message: string, type: NotificationType = 'info') {
    ElNotification({
      title,
      message,
      type,
      duration: 3000,
      position: 'top-right',
    })
  }

  function success(message: string) {
    notify('Success', message, 'success')
  }

  function error(message: string) {
    notify('Error', message, 'error')
  }

  function warning(message: string) {
    notify('Warning', message, 'warning')
  }

  return { notify, success, error, warning }
}
