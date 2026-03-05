import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoStats from '../components/todo/TodoStats.vue'

describe('TodoStats', () => {
  it('should render stat cards', () => {
    const wrapper = mount(TodoStats, {
      props: {
        stats: {
          total: 10,
          completed: 4,
          pending: 6,
          highPriority: 3,
        },
      },
    })

    const cards = wrapper.findAll('.stat-card')
    expect(cards.length).toBe(4)

    expect(wrapper.text()).toContain('10')
    expect(wrapper.text()).toContain('4')
    expect(wrapper.text()).toContain('6')
    expect(wrapper.text()).toContain('3')
  })

  it('should display correct labels', () => {
    const wrapper = mount(TodoStats, {
      props: {
        stats: { total: 0, completed: 0, pending: 0, highPriority: 0 },
      },
    })

    expect(wrapper.text()).toContain('Total Tasks')
    expect(wrapper.text()).toContain('Pending')
    expect(wrapper.text()).toContain('Completed')
    expect(wrapper.text()).toContain('High Priority')
  })
})
