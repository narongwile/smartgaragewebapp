import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Maintenance from './Maintenance'

export default class Receipt extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public payment_date: DateTime

  @column()
  public cost: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany( ()=> Maintenance)
  public maintenances: HasMany<typeof Maintenance>
}
