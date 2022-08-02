import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ResetPasswordValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    password: schema.string([rules.confirmed(), rules.minLength(6), rules.required()]),
    rememberMeToken: schema.string({ trim: true }, [rules.required()]),
  })

  public messages = {}
}
