import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Role from 'App/Models/Role'
import RoleValidator from 'App/Validators/RoleValidator'

export default class RolesController {
  public async index({ request, response, auth }: HttpContextContract) {
    const { page, perPage } = request.all()

    const roles = await Role.query().paginate(page, perPage)

    return response.json(roles)
  }

  public async store({ response, request }: HttpContextContract) {
    const data = await request.validate(RoleValidator)

    const role = await Role.create({ ...data })

    return response.json(role)
  }

  public async show({ request, response }: HttpContextContract) {
    const { id } = request.params()

    const role = await Role.findOrFail(id)

    return response.json(role)
  }

  public async update({ request, response }: HttpContextContract) {
    const { id } = request.params()

    const role = await Role.findOrFail(id)
    const data = await request.validate(RoleValidator)

    role.merge({ ...data })
    await role.save()

    return response.json(role)
  }

  public async destroy({ request, response }: HttpContextContract) {
    const { id } = request.params()

    const role = await Role.findOrFail(id)

    await role.delete()

    return response.status(200)
  }
}
