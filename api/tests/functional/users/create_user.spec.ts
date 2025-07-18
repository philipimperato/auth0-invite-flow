import { test } from '@japa/runner'
import User from '#models/user'

test.group('User Create', () => {
  const userWithDefaults = {
    email: 'test@example.com',
    clientId: 1,
    authId: 'test-auth-id',
  }

  test('should create user with nullable firstName and lastName', async ({ assert }) => {
    const user = await User.create({
      ...userWithDefaults,
      firstName: null,
      lastName: null,
    })

    assert.equal(user.email, 'test@example.com')
    assert.isNull(user.firstName)
    assert.isNull(user.lastName)
    assert.exists(user.id)
  })

  test('should enforce unique email constraint', async ({ assert }) => {
    await User.create({
      ...userWithDefaults,
      email: 'unique@example.com',
    })

    let errorThrown = false

    try {
      await User.create({
        ...userWithDefaults,
        email: 'unique@example.com',
      })
    } catch (error) {
      errorThrown = true
      assert.equal(error.code, '23505')
      assert.equal(error.constraint, 'auth_users_email_unique')
    }

    assert.isTrue(errorThrown, 'Expected unique constraint violation')
  })
})
