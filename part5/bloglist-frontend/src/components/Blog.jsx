import { useState } from 'react'

const Blog = ({ blog, updateLikes, deleteBlog, showRemove }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  if (!visible) {
    return (
      <div style={blogStyle}>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>view</button>
      </div>
    )
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>hide</button>
      </div>
      <div>{blog.url}</div>
      <div>
        likes {blog.likes}
        <button onClick={updateLikes}>like</button>
      </div>
      <div>{blog.user && blog.user.name}</div>
      {showRemove && (
        <div>
          <button onClick={deleteBlog}>remove</button>
        </div>
      )}
    </div>
  )
}

export default Blog
