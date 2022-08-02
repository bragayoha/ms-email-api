import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

test.group('Game show', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()

    return () => Database.rollbackGlobalTransaction()
  })

  test('user must be logged in before get a game', async ({ client }) => {
    const response = await client.get('/v1/api/games/1')

    response.assertStatus(401)

    response.assertBodyContains({
      errors: [{ message: 'E_UNAUTHORIZED_ACCESS: Unauthorized access' }],
    })
  })

  test('get a game by id', async ({ client, route }) => {
    const login = await client.post(route('AuthController.login')).form({
      email: 'admin@example.com',
      password: 'test123',
    })

    const token = login.body().token.token

    const response = await client.get('/v1/api/games/1').bearerToken(token)

    response.assertStatus(200)
    response.assertBodyContains([
      {
        type: String,
        description: String,
        range: Number,
        price: Number,
        min_and_max_number: Number,
        color: String,
      },
    ])
  })
})
