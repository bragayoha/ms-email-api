import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

test.group('Game update', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()

    return () => Database.rollbackGlobalTransaction()
  })

  test('user must be logged in before update a game', async ({ client }) => {
    const response = await client.put('/v1/api/games/1')

    response.assertStatus(401)

    response.assertBodyContains({
      errors: [{ message: 'E_UNAUTHORIZED_ACCESS: Unauthorized access' }],
    })
  })

  test('game content isnt provided', async ({ client, route }) => {
    const login = await client.post(route('AuthController.login')).form({
      email: 'admin@example.com',
      password: 'test123',
    })

    const token = login.body().token.token

    const response = await client.put('/v1/api/games/1').bearerToken(token)

    response.assertStatus(422)

    response.assertBodyContains({
      errors: [
        {
          rule: 'required',
          field: 'type' || 'description' || 'range' || 'price' || 'minAndMaxNumber' || 'color',
          message: 'required validation failed',
        },
      ],
    })
  })

  test('range, price and minAndMaxNumber must be positive', async ({ client, route }) => {
    const login = await client.post(route('AuthController.login')).form({
      email: 'admin@example.com',
      password: 'test123',
    })

    const token = login.body().token.token

    const response = await client
      .post(route('GamesController.store'))
      .form({
        type: 'Lotofacil',
        description: 'Jogo teste para teste automatizado',
        range: -15,
        price: -2.5,
        minAndMaxNumber: -5,
        color: '#7F3992',
      })
      .bearerToken(token)

    response.assertStatus(422)

    response.assertBodyContains({
      errors: [
        {
          rule: 'unsigned',
          field: 'range' || 'price' || 'minAndMaxNumber',
          message: 'unsigned validation failed',
        },
      ],
    })
  })

  test('type must be unique', async ({ client, route }) => {
    const login = await client.post(route('AuthController.login')).form({
      email: 'admin@example.com',
      password: 'test123',
    })

    const token = login.body().token.token

    const response = await client
      .post(route('GamesController.store'))
      .form({
        type: 'Quina',
        description: 'Jogo teste para teste automatizado',
        range: 15,
        price: 2.5,
        minAndMaxNumber: 5,
        color: '#7F3992',
      })
      .bearerToken(token)

    response.assertStatus(422)

    response.assertBodyContains({
      errors: [
        {
          rule: 'unique',
          field: 'type',
          message: 'unique validation failure',
        },
      ],
    })
  })

  test('color must be unique', async ({ client, route }) => {
    const login = await client.post(route('AuthController.login')).form({
      email: 'admin@example.com',
      password: 'test123',
    })

    const token = login.body().token.token

    const response = await client
      .post(route('GamesController.store'))
      .form({
        type: 'Lotofacil',
        description: 'Jogo teste para teste automatizado',
        range: 15,
        price: 2.5,
        minAndMaxNumber: 5,
        color: '#01AC66',
      })
      .bearerToken(token)

    response.assertStatus(422)

    response.assertBodyContains({
      errors: [
        {
          rule: 'unique',
          field: 'color',
          message: 'unique validation failure',
        },
      ],
    })
  })

  test('color must be a hexadecimal color code', async ({ client, route }) => {
    const login = await client.post(route('AuthController.login')).form({
      email: 'admin@example.com',
      password: 'test123',
    })

    const token = login.body().token.token

    const response = await client
      .post(route('GamesController.store'))
      .form({
        type: 'Lotofacil',
        description: 'Jogo teste para teste automatizado',
        range: 15,
        price: 2.5,
        minAndMaxNumber: 5,
        color: 'asdadada',
      })
      .bearerToken(token)

    response.assertStatus(422)

    response.assertBodyContains({
      errors: [
        {
          rule: 'regex',
          field: 'color',
          message: 'regex validation failed',
        },
      ],
    })
  })

  test('make sure game content is provided', async ({ client, route }) => {
    const login = await client.post(route('AuthController.login')).form({
      email: 'admin@example.com',
      password: 'test123',
    })

    const token = login.body().token.token

    const response = await client
      .post(route('GamesController.store'))
      .form({
        type: 'Lototest',
        description: 'Jogo teste para teste automatizado',
        range: 15,
        price: 2.5,
        minAndMaxNumber: 5,
        color: '#FFFFFF',
      })
      .bearerToken(token)

    response.assertStatus(200)

    response.assertBodyContains([
      {
        type: 'Lototest',
        description: 'Jogo teste para teste automatizado',
        range: 15,
        price: 2.5,
        min_and_max_number: 5,
        color: '#FFFFFF',
      },
    ])
  })
})
