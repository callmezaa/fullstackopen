import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { test, expect, vi } from 'vitest'
import BlogForm from './BlogForm'

test('form calls the handler with the right details when a new blog is created', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  const { container } = render(<BlogForm createBlog={createBlog} />)

  const titleInput = container.querySelector('input[name="Title"]')
  const authorInput = container.querySelector('input[name="Author"]')
  const urlInput = container.querySelector('input[name="Url"]')
  const createButton = screen.getByText('create')

  await user.type(titleInput, 'Canonical string reduction')
  await user.type(authorInput, 'Edsger W. Dijkstra')
  await user.type(urlInput, 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html')
  await user.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html'
  })
})
