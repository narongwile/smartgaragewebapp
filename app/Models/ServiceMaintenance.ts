import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Service from './Service'
import Maintenance from './Maintenance'
import OrderPart from './OrderPart'

export default class ServiceMaintenance extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public maintenance_id: number

  @column()
  public service_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo( ()=> Service, {
    foreignKey: 'service_id'
  })
  public services:  BelongsTo<typeof Service>

  @belongsTo ( ()=> Maintenance, {
    foreignKey: 'maintenance_id'
  })
  public maintenances: BelongsTo<typeof Maintenance>

  @hasMany(() => OrderPart, {
    foreignKey: 'service_maintenance_id'
  })
  public order_parts: HasMany<typeof OrderPart>
}
