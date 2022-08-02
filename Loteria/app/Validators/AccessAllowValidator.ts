import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AccessAllowValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    roles: schema
      .array([rules.minLength(1)])
      .members(schema.string({ trim: true }, [rules.exists({ table: 'roles', column: 'name' })])),
  })

  public messages = {}
}
