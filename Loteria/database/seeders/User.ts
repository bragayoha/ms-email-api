import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

import User from 'App/Models/User'
import Role from 'App/Models/Role'

export default class extends BaseSeeder {
  public static developmentOnly = true

  public async run() {
    const searchKeyAdmin = { email: 'admin@example.com' }
    const userAdmin = await User.updateOrCreate(searchKeyAdmin, {
      cpf: '00000000000',
      name: 'admin',
      email: 'admin@example.com',
      password: 'test123',
    })

    const searchKeyPlayer = { email: 'player@example.com' }
    const userPlayer = await User.updateOrCreate(searchKeyPlayer, {
      cpf: '00000000001',
      name: 'player',
      email: 'player@example.com',
      password: 'test123',
    })

    const roleAdmin = await Role.findBy('name', 'admin')
    const rolePlayer = await Role.findBy('name', 'player')

    if (roleAdmin && rolePlayer)
      await userAdmin.related('roles').attach([roleAdmin.id, rolePlayer.id])
    if (rolePlayer) await userPlayer.related('roles').attach([rolePlayer.id])
  }
}
