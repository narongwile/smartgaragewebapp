import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import PartCondition from './PartCondition'
import ServiceMaintenance from './ServiceMaintenance'

export default class OrderPart extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public service_maintenance_id:  number

  @column()
  public part_condition_id: number

  @column()
  public order_date:  DateTime

  @column()
  public quantity:  number

  @column()
  public sell_price:  number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo( ()=> ServiceMaintenance, {
    foreignKey: 'service_maintenance_id',
  })
  public service_maintenances:  BelongsTo<typeof ServiceMaintenance>

  @belongsTo ( ()=> PartCondition, {
    foreignKey: 'part_condition_id'
  })
  public part_conditions: BelongsTo<typeof PartCondition>
}
