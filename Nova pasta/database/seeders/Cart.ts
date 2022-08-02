import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Cart from 'App/Models/Cart'

export default class extends BaseSeeder {
  public static developmentOnly = true

  public async run() {
    const uniqueKey = 'minCartValue'

    await Cart.updateOrCreateMany(uniqueKey, [
      {
        minCartValue: 30,
      },
    ])
  }
}
