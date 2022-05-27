import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import VehicleModel from './VehicleModel'
import Maintenance from './Maintenance'
import Customer from './Customer'

export default class Vehicle extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public customer_id: number

  @column()
  public vehiclemodel_id: number

  @column()
  public license_id:  string

  @column()
  public colour:  string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo( ()=> Customer, {
    foreignKey: 'customer_id'
  })
  public customers: BelongsTo<typeof Customer>

  @belongsTo( ()=> VehicleModel, {
    foreignKey: 'vehiclemodel_id'
  })
  public vehicle_models:  BelongsTo<typeof VehicleModel>

  @hasMany( ()=> Maintenance)
  public maintenances:  HasMany<typeof Maintenance>
}
