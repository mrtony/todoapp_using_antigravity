import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ElementPlus from 'element-plus'
import TodoList from '../components/todo/TodoList.vue'
import TodoItem from '../components/todo/TodoItem.vue'
import type { Todo } from '../types/todo'

const mockTodos: Todo[] = [
  { id: 1, title: 'First', content: 'desc', priority: 'high', completed: false, remindAt: null, createdAt: '2026-03-05', updatedAt: '2026-03-05' },
  { id: 2, title: 'Second', content: '', priority: 'low', completed: true, remindAt: null, createdAt: '2026-03-05', updatedAt: '2026-03-05' },
]

describe('TodoList', () => {
  it('should render todo items', () => {
    const wrapper = mount(TodoList, {
      props: { todos: mockTodos },
      global: { plugins: [ElementPlus] },
    })

    const items = wrapper.findAllComponents(TodoItem)
    expect(items.length).toBe(2)
  })

  it('should show empty state when no todos', () => {
    const wrapper = mount(TodoList, {
      props: { todos: [] },
      global: { plugins: [ElementPlus] },
    })

    // Element Plus components are now registered, el-empty should render
    expect(wrapper.find('.el-empty').exists()).toBe(true)
  })
})
