import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import OrderPart from './OrderPart'
import Employee from './Employee'
import Vehicle from './Vehicle'
import Garage from './Garage'

export default class Maintenance extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public vehicle_id:  number

  @column()
  public garage_id: number

  @column()
  public employee_id: number

  @column()
  public start_date:  DateTime

  @column()
  public end_date:  DateTime

  @column()
  public status:  string

  @column()
  public comment: string

  @column()
  public maintain_cost: number

  @column()
  public payment_date:  DateTime

  @column()
  public quotation_id:  number

  @column()
  public invoice_id:  number

  @column()
  public receipt_id:  number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo( ()=> Employee)
  public employees: BelongsTo<typeof Employee>

  @belongsTo( ()=> Vehicle)
  public vehicles:  BelongsTo<typeof Vehicle>

  @belongsTo( ()=> Garage)
  public garages: BelongsTo<typeof Garage>

  @hasMany( ()=> OrderPart)
  public order_parts: HasMany<typeof OrderPart>
}
