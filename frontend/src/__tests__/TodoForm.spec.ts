import { describe, it, expect, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import ElementPlus from 'element-plus'
import TodoForm from '../components/todo/TodoForm.vue'

describe('TodoForm', () => {
  let wrapper: ReturnType<typeof mount>

  afterEach(() => {
    wrapper?.unmount()
    // Clean up teleported dialog
    document.body.innerHTML = ''
  })

  function mountForm(props = {}) {
    wrapper = mount(TodoForm, {
      props: {
        modelValue: true,
        ...props,
      },
      global: {
        plugins: [ElementPlus],
      },
      attachTo: document.body,
    })
    return wrapper
  }

  it('should show New Todo title by default', async () => {
    mountForm()
    await nextTick()
    await flushPromises()
    await nextTick()

    const dialogTitle = document.body.querySelector('.el-dialog__title')
    expect(dialogTitle?.textContent).toContain('New Todo')
  })

  it('should show Edit Todo title when todo is provided', async () => {
    mountForm({
      todo: {
        id: 1,
        title: 'Existing',
        content: 'desc',
        priority: 'high',
        completed: false,
        remindAt: null,
        createdAt: '2026-03-05',
        updatedAt: '2026-03-05',
      },
    })
    await nextTick()
    await flushPromises()
    await nextTick()

    const dialogTitle = document.body.querySelector('.el-dialog__title')
    expect(dialogTitle?.textContent).toContain('Edit Todo')
  })

  it('should render create button by default', async () => {
    mountForm()
    await nextTick()
    await flushPromises()
    await nextTick()

    const buttons = document.body.querySelectorAll('.el-button')
    const createBtn = Array.from(buttons).find((btn) => btn.textContent?.trim() === 'Create')
    expect(createBtn).toBeTruthy()
  })
})
