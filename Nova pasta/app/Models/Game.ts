import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Bet from './Bet'

export default class Game extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column()
  public type: string

  @column()
  public description: string

  @column()
  public range: number

  @column()
  public price: number

  @column()
  public minAndMaxNumber: number

  @column()
  public color: string

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serializeAs: null,
  })
  public updatedAt: DateTime

  @hasMany(() => Bet)
  public bets: HasMany<typeof Bet>
}
