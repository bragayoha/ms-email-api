import Database from '@ioc:Adonis/Lucid/Database'

import { test } from '@japa/runner'

test.group('User auth', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()

    return () => Database.rollbackGlobalTransaction()
  })

  test('login with a user', async ({ client, route }) => {
    const response = await client.post(route('AuthController.login')).form({
      email: 'admin@example.com',
      password: 'test123',
    })

    response.assertStatus(200)

    response.assertBodyContains({
      token: {
        type: 'bearer',
      },
      user: {
        email: 'admin@example.com',
      },
    })
  })

  test('login with invalid credentials', async ({ client, route }) => {
    const response = await client.post(route('AuthController.login')).form({
      email: 'user@example.com',
      password: 'test123',
    })

    response.assertStatus(401)

    response.assertBodyContains({
      message: 'Invalid credentials',
      originalError: 'E_INVALID_AUTH_UID: User not found',
    })
  })
})
