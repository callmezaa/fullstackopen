const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcryptjs')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

describe('login', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('succeeds with correct credentials', async () => {
    const response = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.ok(response.body.token)
    assert.strictEqual(response.body.username, 'root')
  })

  test('fails with wrong password', async () => {
    const result = await api
      .post('/api/login')
      .send({ username: 'root', password: 'wrong' })
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert.ok(result.body.error.includes('invalid username or password'))
    assert.strictEqual(result.body.token, undefined)
  })

  test('fails with unknown username', async () => {
    const result = await api
      .post('/api/login')
      .send({ username: 'nobody', password: 'sekret' })
      .expect(401)

    assert.ok(result.body.error.includes('invalid username or password'))
  })
})

after(async () => {
  await mongoose.connection.close()
})
