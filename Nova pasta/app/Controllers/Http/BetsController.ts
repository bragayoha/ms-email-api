import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Bet from 'App/Models/Bet'
import Cart from 'App/Models/Cart'

import User from 'App/Models/User'
import { sendMail } from 'App/Services/sendMail'
import BetValidator from 'App/Validators/BetValidator'

export default class BetsController {
  public async index({ request, response }: HttpContextContract) {
    const { page, perPage, noPaginate } = request.qs()

    if (noPaginate) {
      return Bet.query()
    }

    try {
      const bets = await Bet.query().paginate(page || 1, perPage || 10)

      return response.ok(bets)
    } catch (error) {
      return response.badRequest({ message: 'Error in list bets', originalError: error.message })
    }
  }

  public async store({ response, request, auth }: HttpContextContract) {
    const data = await request.validate(BetValidator)

    const user = await User.findByOrFail('id', auth.user?.id)
    const cart = await Cart.findByOrFail('id', 1)

    let bet
    const trx = await Database.transaction()

    if (data.validCart === 30)
      return response.status(422).json({ message: 'Total price is below to min cart value' })

    try {
      bet = await Bet.create(
        {
          numbers: data.numbers.join(),
          userId: auth.user?.id,
          gameId: data.game,
        },
        trx
      )
    } catch (error) {
      trx.rollback()
      return response.badRequest({ message: 'Error in store bet', originalError: error.message })
    }

    let betFind

    try {
      betFind = await Bet.query().where('id', bet.id)
    } catch (error) {
      trx.rollback()
      return response.badRequest({ message: 'Error in find bet', originalError: error.message })
    }

    try {
      await sendMail(user, 'email/new_bet')
    } catch (error) {
      trx.rollback()
      return response.badRequest({
        message: 'Error in send email',
        originalError: error.message,
      })
    }
    trx.commit()

    return response.ok(betFind)
  }

  public async show({ response, params }: HttpContextContract) {
    const betId = params.id

    try {
      const bet = await Bet.query().where('id', betId)

      return response.ok(bet)
    } catch (error) {
      return response.notFound({ message: 'Bet not found', originalError: error.message })
    }
  }

  public async destroy({ response, params }: HttpContextContract) {
    const betId = params.id

    try {
      const bet = await Bet.findByOrFail('id', betId)
      await bet.delete()

      return response.ok({ message: 'Bet deleted' })
    } catch (error) {
      return response.notFound({ message: 'Bet not found', originalError: error.message })
    }
  }
}
