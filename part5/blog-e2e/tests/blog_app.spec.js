const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.locator('input[name="Username"]')).toBeVisible()
    await expect(page.locator('input[name="Password"]')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged in', { exact: true })).toBeVisible()
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('wrong username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Playwright blog', 'E2E Tester', 'https://example.com/e2e')
      await expect(page.getByText('Playwright blog E2E Tester')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'Likable blog', 'E2E Tester', 'https://example.com/like')

      const blogElement = page.locator('.blog', { hasText: 'Likable blog' })
      await blogElement.getByRole('button', { name: 'view' }).click()
      await expect(blogElement.getByText('likes 0')).toBeVisible()

      await blogElement.getByRole('button', { name: 'like' }).click()
      await expect(blogElement.getByText('likes 1')).toBeVisible()
    })

    test('a blog can be deleted by its creator', async ({ page }) => {
      await createBlog(page, 'Deletable blog', 'E2E Tester', 'https://example.com/delete')

      const blogElement = page.locator('.blog', { hasText: 'Deletable blog' })
      await blogElement.getByRole('button', { name: 'view' }).click()
      await expect(blogElement.getByRole('button', { name: 'remove' })).toBeVisible()

      page.on('dialog', async (dialog) => {
        await dialog.accept()
      })
      await blogElement.getByRole('button', { name: 'remove' }).click()

      await expect(page.getByText('Deletable blog E2E Tester')).not.toBeVisible()
    })

    test('only the creator sees the delete button', async ({ page, request }) => {
      await createBlog(page, 'Creators blog', 'E2E Tester', 'https://example.com/creator')

      await request.post('/api/users', {
        data: { name: 'Other User', username: 'other', password: 'salainen' }
      })

      await page.getByRole('button', { name: 'logout' }).click()
      await loginWith(page, 'other', 'salainen')
      await expect(page.getByText('Other User logged in', { exact: true })).toBeVisible()

      const blogElement = page.locator('.blog', { hasText: 'Creators blog' })
      await blogElement.getByRole('button', { name: 'view' }).click()
      await expect(blogElement.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })

    test('blogs are ordered by likes, most liked first', async ({ page }) => {
      await createBlog(page, 'First blog', 'E2E Tester', 'https://example.com/first')
      await createBlog(page, 'Second blog', 'E2E Tester', 'https://example.com/second')

      const secondBlog = page.locator('.blog', { hasText: 'Second blog' })
      await secondBlog.getByRole('button', { name: 'view' }).click()
      await secondBlog.getByRole('button', { name: 'like' }).click()
      await expect(secondBlog.getByText('likes 1')).toBeVisible()
      await secondBlog.getByRole('button', { name: 'like' }).click()
      await expect(secondBlog.getByText('likes 2')).toBeVisible()

      const blogs = page.locator('.blog')
      await expect(blogs.nth(0)).toContainText('Second blog')
      await expect(blogs.nth(1)).toContainText('First blog')
    })
  })
})
