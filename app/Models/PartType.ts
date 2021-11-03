import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Part from './Part'

export default class PartType extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public parttype:  string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
  
  @hasMany( ()=> Part)
  public parts: HasMany<typeof Part>

}