import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class BetValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    numbers: schema
      .array([rules.minLength(5), rules.maxLength(5)])
      .members(schema.number([rules.required()])),
    game: schema.number([rules.exists({ table: 'games', column: 'id' })]),
    validCart: schema.number.optional([rules.exists({ table: 'carts', column: 'min_cart_value' })]),
  })

  public messages = {}
}
