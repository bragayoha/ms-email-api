import Database from '@ioc:Adonis/Lucid/Database'

import { test } from '@japa/runner'

test.group('Users store', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()

    return () => Database.rollbackGlobalTransaction()
  })

  test('make sure user content is provided', async ({ client, route }) => {
    const response = await client.post(route('UsersController.store'))

    response.assertStatus(422)

    response.assertBodyContains({
      errors: [
        { message: 'required validation failed', field: 'name' || 'cpf' || 'email' || 'password' },
      ],
    })
  })

  test('store new user in database', async ({ client, route }) => {
    const response = await client.post(route('UsersController.store')).form({
      name: 'Test User',
      email: 'user@test.com',
      cpf: '000.000.000-00',
      password: 'test123',
      password_confirmation: 'test123',
    })

    response.assertStatus(200)

    response.assertBodyContains({
      userFind: [{ name: 'Test User', cpf: '000.000.000-00', email: 'user@test.com' }],
    })
  })

  test('error in store new user in database with invalid email', async ({ client, route }) => {
    const response = await client.post(route('UsersController.store')).form({
      name: 'Test User',
      email: 'usertest.com',
      cpf: '000.000.000-00',
      password: 'test123',
      password_confirmation: 'test123',
    })

    response.assertStatus(422)

    response.assertBodyContains({
      errors: [{ message: 'email validation failed', field: 'email', rule: 'email' }],
    })
  })

  test('error in store new user in database with invalid password confirmation', async ({
    client,
    route,
  }) => {
    const response = await client.post(route('UsersController.store')).form({
      name: 'Test User',
      email: 'user@test.com',
      cpf: '000.000.000-00',
      password: 'test123',
      password_confirmation: 'test124',
    })

    response.assertStatus(422)

    response.assertBodyContains({
      errors: [
        {
          message: 'confirmed validation failed',
          field: 'password_confirmation',
          rule: 'confirmed',
        },
      ],
    })
  })

  test('error in store new user in database with invalid cpf format', async ({ client, route }) => {
    const response = await client.post(route('UsersController.store')).form({
      name: 'Test User',
      email: 'user@test.com',
      cpf: '000.000.000-0',
      password: 'test123',
      password_confirmation: 'test123',
    })

    response.assertStatus(422)

    response.assertBodyContains({
      errors: [
        {
          message: 'regex validation failed',
          field: 'cpf',
          rule: 'regex',
        },
      ],
    })
  })
})
