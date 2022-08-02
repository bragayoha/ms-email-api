import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'

import User from './User'
import Game from './Game'

export default class Bet extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column()
  public userId: number

  @column()
  public gameId: number

  @column()
  public numbers: string

  @column.dateTime({ autoCreate: true, serialize: (value) => value.toFormat('dd/MM/yyyy') })
  public createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serialize: (value) => value.toFormat('dd/MM/yyyy'),
  })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Game)
  public game: BelongsTo<typeof Game>
}
