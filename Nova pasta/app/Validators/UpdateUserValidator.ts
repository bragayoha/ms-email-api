import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public refs = schema.refs({
    id: this.ctx.params.id,
  })

  public schema = schema.create({
    cpf: schema.string.optional({ trim: true }, [
      rules.unique({ table: 'users', column: 'cpf', whereNot: { secure_id: this.refs.id } }),
      rules.regex(/^\d{3}.\d{3}.\d{3}-\d{2}$/),
      rules.required(),
    ]),
    name: schema.string.optional({ trim: true }, [
      rules.required(),
      rules.regex(/^[ a-zA-ZÀ-ÿ\u00f1\u00d1]*$/g),
    ]),
    email: schema.string.optional({ trim: true }, [
      rules.unique({
        table: 'users',
        column: 'email',
        caseInsensitive: true,
        whereNot: { secure_id: this.refs.id },
      }),
      rules.email(),
      rules.required(),
    ]),
  })

  public messages = {}
}
