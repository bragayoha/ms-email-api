import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  beforeSave,
  hasMany,
  HasMany,
  manyToMany,
  ManyToMany,
  beforeCreate,
} from '@ioc:Adonis/Lucid/Orm'

import { v4 as uuidv4 } from 'uuid'
import Hash from '@ioc:Adonis/Core/Hash'
import Bet from './Bet'
import Role from './Role'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public secureId: uuidv4

  @column({ serializeAs: null })
  public rememberMeToken?: string

  @column()
  public name: string

  @column()
  public cpf: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column.dateTime({ autoCreate: true, serialize: (value) => value.toFormat('dd/MM/yyyy') })
  public createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serialize: (value) => value.toFormat('dd/MM/yyyy'),
  })
  public updatedAt: DateTime

  @hasMany(() => Bet)
  public bets: HasMany<typeof Bet>

  @manyToMany(() => Role, {
    pivotTable: 'user_roles',
  })
  public roles: ManyToMany<typeof Role>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @beforeCreate()
  public static assignUuid(user: User) {
    user.secureId = uuidv4()
  }
}
