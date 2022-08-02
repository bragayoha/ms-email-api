import Route from '@ioc:Adonis/Core/Route'
import Database from '@ioc:Adonis/Lucid/Database'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

Route.get('test_db_connection', async ({ response }: HttpContextContract) => {
  await Database.report().then(({ health }) => {
    const { healthy, message } = health

    if (healthy) return response.ok({ message })

    return response.status(500).json({ message })
  })
})

// Public Routes Group
Route.group(() => {
  Route.post('login', 'AuthController.login')
  Route.post('users/', 'UsersController.store')
}).prefix('v1/api')

// Private Routes Group
Route.group(() => {
  Route.resource('users/', 'UsersController').except(['store', 'index', 'destroy'])
  Route.put('reset-password', 'UsersController.resetPassword')

  Route.get('games/:id', 'GamesController.show')

  Route.get('bets/:id', 'BetsController.show')
  Route.post('bets/', 'BetsController.store')
  Route.delete('bets/:id', 'BetsController.destroy')
})
  .prefix('v1/api')
  .middleware(['auth', 'is:player'])

// Admin Routes Group
Route.group(() => {
  Route.resource('users/', 'UsersController').only(['index', 'destroy'])

  Route.resource('games/', 'GamesController').except(['show'])

  Route.post('access-allow/:id', 'UsersController.AccessAllow')
  Route.get('bets/', 'BetsController.index')
  Route.put('forget-password/:id', 'UsersController.forgetPassword')
})
  .prefix('v1/api')
  .middleware(['auth', 'is:admin'])
