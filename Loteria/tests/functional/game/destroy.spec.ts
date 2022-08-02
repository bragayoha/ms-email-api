import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

test.group('Game destroy', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()

    return () => Database.rollbackGlobalTransaction()
  })

  test('user must be logged in before destroy a game', async ({ client }) => {
    const response = await client.delete('/v1/api/games/1')

    response.assertStatus(401)

    response.assertBodyContains({
      errors: [{ message: 'E_UNAUTHORIZED_ACCESS: Unauthorized access' }],
    })
  })

  test('destroy a existing game', async ({ client, route }) => {
    const login = await client.post(route('AuthController.login')).form({
      email: 'admin@example.com',
      password: 'test123',
    })

    const token = login.body().token.token

    const response = await client.delete('/v1/api/games/1').bearerToken(token)

    response.assertStatus(200)
    response.assertBodyContains({
      message: 'Game deleted successfully',
    })
  })
})
