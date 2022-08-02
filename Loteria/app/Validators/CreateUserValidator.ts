import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    cpf: schema.string({ trim: true }, [
      rules.unique({ table: 'users', column: 'cpf' }),
      rules.regex(/^\d{3}.\d{3}.\d{3}-\d{2}$/),
      rules.required(),
    ]),
    name: schema.string({ trim: true }, [
      rules.required(),
      rules.regex(/^[ a-zA-ZÀ-ÿ\u00f1\u00d1]*$/g),
    ]),
    email: schema.string({ trim: true }, [
      rules.unique({ table: 'users', column: 'email', caseInsensitive: true }),
      rules.email(),
      rules.required(),
    ]),
    password: schema.string([rules.confirmed(), rules.minLength(6), rules.required()]),
  })

  public messages = {}
}
