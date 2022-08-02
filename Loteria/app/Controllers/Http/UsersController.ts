import Hash from '@ioc:Adonis/Core/Hash'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Role from 'App/Models/Role'
import User from 'App/Models/User'
import { sendMail } from 'App/Services/sendMail'
import AccessAllowValidator from 'App/Validators/AccessAllowValidator'
import CreateUserValidator from 'App/Validators/CreateUserValidator'
import ResetPasswordValidator from 'App/Validators/ResetPasswordValidator'
import UpdateUserValidator from 'App/Validators/UpdateUserValidator'
import dayjs from 'dayjs'

export default class UsersController {
  public async index({ request, response }: HttpContextContract) {
    const { page, perPage, noPaginate } = request.qs()

    if (noPaginate) {
      return User.query().preload('roles', (roleTable) => {
        roleTable.select('id', 'name')
      })
    }

    try {
      const users = await User.query()
        .preload('roles', (roleTable) => {
          roleTable.select('id', 'name')
        })
        .paginate(page || 1, perPage || 10)

      return response.ok(users)
    } catch (error) {
      return response.badRequest({ message: 'Error in list users', originalError: error.message })
    }
  }

  public async store({ response, request }: HttpContextContract) {
    const data = await request.validate(CreateUserValidator)

    let user

    const trx = await Database.transaction()
    try {
      user = await User.create(
        {
          name: data.name,
          cpf: data.cpf,
          email: data.email,
          password: data.password,
        },
        trx
      )

      const rolePlayer = await Role.findBy('name', 'player')

      if (rolePlayer) await user.related('roles').attach([rolePlayer.id])
    } catch (error) {
      trx.rollback()
      return response.badRequest({ message: 'Error in create user', originalError: error.message })
    }

    let userFind
    try {
      userFind = await User.query().where('id', user.id).preload('roles')
    } catch (error) {
      trx.rollback()
      return response.badRequest({ message: 'Error in find user', originalError: error.message })
    }

    try {
      await sendMail(user, 'email/welcome')
    } catch (error) {
      trx.rollback()
      return response.badRequest({
        message: 'Error in send welcome email',
        originalError: error.message,
      })
    }

    trx.commit()
    return response.ok({ userFind })
  }

  public async show({ response, params }: HttpContextContract) {
    const userSecureId = params.id

    try {
      const user = await User.query()
        .where('secure_id', userSecureId)
        .preload('roles')
        .preload('bets', (bet) => {
          const currentDateLess30days = dayjs().subtract(30, 'd').format()

          bet.where('created_at', '>', currentDateLess30days)
        })

      return response.ok(user)
    } catch (error) {
      return response.notFound({ message: 'User not found', originalError: error.message })
    }
  }

  public async update({ request, response, params }: HttpContextContract) {
    const data = await request.validate(UpdateUserValidator)

    const userSecureId = params.id

    let user

    const trx = await Database.transaction()

    try {
      user = await User.findByOrFail('secure_id', userSecureId)
      user.merge({ name: data.name, cpf: data.cpf, email: data.email }, trx).save()
    } catch (error) {
      trx.rollback()
      return response.badRequest({ message: 'Error in update user', originalError: error.message })
    }

    let userFind
    try {
      userFind = await User.query().where('id', user.id).preload('roles')
    } catch (error) {
      trx.rollback()
      return response.badRequest({ message: 'Error in find user', originalError: error.message })
    }

    trx.commit()
    return response.ok({ userFind })
  }

  public async destroy({ response, params }: HttpContextContract) {
    const userSecureId = params.id

    try {
      const user = await User.findByOrFail('secure_id', userSecureId)
      await user.delete()

      return response.ok({ message: 'Success in delete user' })
    } catch (error) {
      return response.notFound({ message: 'User not found', originalError: error.message })
    }
  }

  public async forgetPassword({ response, params }: HttpContextContract) {
    const secureId = params.id

    let user

    const trx = await Database.transaction()

    try {
      user = await User.findByOrFail('secure_id', secureId)
      const rememberMeToken = await Hash.make(user.cpf + dayjs().format())
      user.merge({ rememberMeToken: rememberMeToken }, trx).save()
    } catch (error) {
      trx.rollback()
      return response.badRequest({
        message: 'Error in generate token',
        originalError: error.message,
      })
    }
    try {
      await sendMail(user, 'email/reset_password')
    } catch (error) {
      trx.rollback()
      return response.badRequest({ message: 'Error in send email', originalError: error.message })
    }

    trx.commit()
    return response.ok({ message: 'Success in send recovery email!' })
  }

  public async resetPassword({ request, response }: HttpContextContract) {
    const data = await request.validate(ResetPasswordValidator)

    const trx = await Database.transaction()
    let user
    try {
      user = await User.findByOrFail('remember_me_token', data.rememberMeToken)
      if (user.rememberMeToken === data.rememberMeToken) {
        user.merge(data.password).useTransaction(trx)
        await user.save()
      }
    } catch (error) {
      trx.rollback()
      return response.badRequest({
        message: 'Error in reset password',
        originalError: error.message,
      })
    }

    trx.commit()
    return response.ok({ message: 'Success in reset password' })
  }

  public async AccessAllow({ response, request }: HttpContextContract) {
    await request.validate(AccessAllowValidator)

    const { userId, roles } = request.all()

    try {
      const userAllow = await User.findByOrFail('id', userId)

      let roleIds: number[] = []

      await Promise.all(
        roles.map(async (roleName) => {
          const hasRole = await Role.findBy('name', roleName)
          if (hasRole) roleIds.push(hasRole.id)
        })
      )

      await userAllow.related('roles').sync(roleIds)
    } catch (error) {
      return response.badRequest({ message: 'Error in access allow', originalError: error.message })
    }

    try {
      return User.query().where('id', userId).preload('roles').firstOrFail()
    } catch (error) {
      return response.badRequest({ message: 'Error in find user', originalError: error.message })
    }
  }
}
