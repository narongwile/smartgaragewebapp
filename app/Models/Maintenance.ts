import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Employee from './Employee'
import Vehicle from './Vehicle'
import Garage from './Garage'
import ServiceMaintenance from './ServiceMaintenance'
import Receipt from './Receipt'

export default class Maintenance extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public vehicle_id: number

  @column()
  public garage_id: number

  @column()
  public employee_id: number

  @column()
  public receipt_id: number

  @column()
  public start_date: DateTime

  @column()
  public end_date: DateTime

  @column()
  public status: string

  @column()
  public comment: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Employee, {
    foreignKey: 'employee_id'
  })
  public employees: BelongsTo<typeof Employee>

  @belongsTo( ()=> Vehicle, {
    foreignKey: 'vehicle_id'
  })
  public vehicles:  BelongsTo<typeof Vehicle>

  @belongsTo(() => Garage)
  public garages: BelongsTo<typeof Garage>

  @belongsTo(() => Receipt, {
    foreignKey: 'receipt_id'
  })
  public receipts: BelongsTo<typeof Receipt>

  @hasMany(() => ServiceMaintenance, {
    foreignKey: 'maintenance_id'
  })
  public service_maintenances: HasMany<typeof ServiceMaintenance>
}
