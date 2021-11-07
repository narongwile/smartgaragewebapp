import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Vehicle from './Vehicle'

export default class Customer extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public fname: string

  @column()
  public lname: string

  @column()
  public tel: string

  @column()
  public company: string

  @column()
  public address: string

  @column()
  public customer_tax_id: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password:  string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany( ()=> Vehicle)
  public vehicles:  HasMany<typeof Vehicle>
}
