import { test, expect } from '@playwright/test'

test.describe('Smart Todo E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display dashboard with stats', async ({ page }) => {
    await expect(page.locator('text=Dashboard')).toBeVisible()
    await expect(page.locator('text=Total Tasks')).toBeVisible()
    await expect(page.locator('text=Pending')).toBeVisible()
    await expect(page.locator('text=Completed')).toBeVisible()
  })

  test('should navigate to todos page', async ({ page }) => {
    await page.click('text=Todos')
    await expect(page).toHaveURL('/todos')
    await expect(page.locator('text=All Todos')).toBeVisible()
  })

  test('should create a new todo', async ({ page }) => {
    // Navigate to todos
    await page.click('text=Todos')
    await page.waitForURL('/todos')

    // Click add button
    await page.click('#btn-add-todo')

    // Fill form
    await page.fill('input[placeholder="What needs to be done?"]', 'E2E Test Todo')
    await page.fill('textarea[placeholder="Add some details..."]', 'Created by Playwright')

    // Submit
    await page.click('button:has-text("Create")')

    // Verify todo appears
    await expect(page.locator('text=E2E Test Todo')).toBeVisible({ timeout: 5000 })
  })

  test('should edit a todo', async ({ page }) => {
    // Navigate and create a todo first
    await page.click('text=Todos')
    await page.waitForURL('/todos')
    await page.click('#btn-add-todo')
    await page.fill('input[placeholder="What needs to be done?"]', 'Edit Me')
    await page.click('button:has-text("Create")')
    await expect(page.locator('text=Edit Me')).toBeVisible({ timeout: 5000 })

    // Click edit on the todo
    const todoItem = page.locator('.todo-item', { hasText: 'Edit Me' })
    await todoItem.locator('button:has-text("Edit")').click()

    // Clear and update the title
    const titleInput = page.locator('input[placeholder="What needs to be done?"]')
    await titleInput.clear()
    await titleInput.fill('Edited Todo')
    await page.click('button:has-text("Update")')

    // Verify updated
    await expect(page.locator('text=Edited Todo')).toBeVisible({ timeout: 5000 })
  })

  test('should delete a todo', async ({ page }) => {
    // Navigate and create a todo first
    await page.click('text=Todos')
    await page.waitForURL('/todos')
    await page.click('#btn-add-todo')
    await page.fill('input[placeholder="What needs to be done?"]', 'Delete Me')
    await page.click('button:has-text("Create")')
    await expect(page.locator('text=Delete Me')).toBeVisible({ timeout: 5000 })

    // Delete it
    const todoItem = page.locator('.todo-item', { hasText: 'Delete Me' })
    await todoItem.locator('button:has-text("Delete")').click()

    // Verify deleted
    await expect(page.locator('text=Delete Me')).not.toBeVisible({ timeout: 5000 })
  })

  test('should toggle todo completion', async ({ page }) => {
    // Navigate and create a todo
    await page.click('text=Todos')
    await page.waitForURL('/todos')
    await page.click('#btn-add-todo')
    await page.fill('input[placeholder="What needs to be done?"]', 'Toggle Me')
    await page.click('button:has-text("Create")')
    await expect(page.locator('text=Toggle Me')).toBeVisible({ timeout: 5000 })

    // Toggle completion
    const todoItem = page.locator('.todo-item', { hasText: 'Toggle Me' })
    await todoItem.locator('.el-checkbox').click()

    // Verify completed state (strikethrough class)
    await expect(todoItem).toHaveClass(/todo-item--completed/, { timeout: 5000 })
  })
})
