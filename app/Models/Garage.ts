import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Maintenance from './Maintenance'

export default class Garage extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public company_th:  string

  @column()
  public company_en:  string

  @column()
  public email: string

  @column()
  public tel: string

  @column()
  public tax_id:  string

  @column()
  public address: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany( ()=> Maintenance)
  public maintenances:  HasMany<typeof Maintenance>
}
