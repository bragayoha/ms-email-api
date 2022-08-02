import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

import Role from 'App/Models/Role'

export default class extends BaseSeeder {
  public static developmentOnly = true

  public async run() {
    const uniqueKey = 'name'

    await Role.updateOrCreateMany(uniqueKey, [
      {
        name: 'admin',
      },
      {
        name: 'player',
      },
    ])
  }
}
