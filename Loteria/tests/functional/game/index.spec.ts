import Database from '@ioc:Adonis/Lucid/Database'

import { test } from '@japa/runner'

test.group('Game index', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()

    return () => Database.rollbackGlobalTransaction()
  })

  test('user must be logged in before get a list of games', async ({ client, route }) => {
    const response = await client.get(route('GamesController.index'))

    response.assertStatus(401)

    response.assertBodyContains({
      errors: [{ message: 'E_UNAUTHORIZED_ACCESS: Unauthorized access' }],
    })
  })

  test('get a list of games', async ({ client, route }) => {
    const login = await client.post(route('AuthController.login')).form({
      email: 'admin@example.com',
      password: 'test123',
    })

    const token = login.body().token.token

    const response = await client.get(route('GamesController.index')).bearerToken(token)

    response.assertStatus(200)

    response.assertBodyContains({
      minCartValue: Number,
      types: [
        {
          type: String,
          description: String,
          range: Number,
          price: Number,
          min_and_max_number: Number,
          color: String,
        },
      ],
    })
  })
})
