import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { test, expect, vi } from 'vitest'
import Blog from './Blog'

const blog = {
  title: 'Canonical string reduction',
  author: 'Edsger W. Dijkstra',
  url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
  likes: 12,
  user: {
    username: 'root',
    name: 'Superuser',
    id: '6879a8e1f1c2d3e4f5a6b7c8d'
  },
  id: '6879a8e1f1c2d3e4f5a6b7c9e'
}

test('renders title and author but not url or likes by default', () => {
  const { container } = render(
    <Blog blog={blog} updateLikes={() => {}} deleteBlog={() => {}} showRemove={false} />
  )

  const element = container.querySelector('div')
  expect(element).toHaveTextContent('Canonical string reduction')
  expect(element).toHaveTextContent('Edsger W. Dijkstra')
  expect(screen.queryByText('http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html')).toBeNull()
  expect(screen.queryByText('likes 12', { exact: false })).toBeNull()
})

test('url and likes are shown when the view button is clicked', async () => {
  render(
    <Blog blog={blog} updateLikes={() => {}} deleteBlog={() => {}} showRemove={false} />
  )

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  expect(screen.getByText('http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html')).toBeVisible()
  expect(screen.getByText('likes 12', { exact: false })).toBeVisible()
})

test('clicking the like button twice calls the handler twice', async () => {
  const mockHandler = vi.fn()

  render(
    <Blog blog={blog} updateLikes={mockHandler} deleteBlog={() => {}} showRemove={false} />
  )

  const user = userEvent.setup()
  await user.click(screen.getByText('view'))
  await user.click(screen.getByText('like'))
  await user.click(screen.getByText('like'))

  expect(mockHandler.mock.calls).toHaveLength(2)
})
