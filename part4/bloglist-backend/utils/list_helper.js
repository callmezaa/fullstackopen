const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  return blogs.reduce((favorite, blog) => {
    return blog.likes > favorite.likes ? blog : favorite
  })
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const counts = {}
  blogs.forEach((blog) => {
    counts[blog.author] = (counts[blog.author] || 0) + 1
  })

  const topAuthor = Object.keys(counts).reduce((top, author) => {
    return counts[author] > counts[top] ? author : top
  })

  return {
    author: topAuthor,
    blogs: counts[topAuthor]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const likes = {}
  blogs.forEach((blog) => {
    likes[blog.author] = (likes[blog.author] || 0) + blog.likes
  })

  const topAuthor = Object.keys(likes).reduce((top, author) => {
    return likes[author] > likes[top] ? author : top
  })

  return {
    author: topAuthor,
    likes: likes[topAuthor]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
