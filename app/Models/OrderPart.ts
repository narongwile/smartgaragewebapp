import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Maintenance from './Maintenance'
import Part from './Part'

export default class OrderPart extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public maintenance_id:  number

  @column()
  public part_id: number

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

  @belongsTo( ()=> Maintenance)
  public maintenances:  BelongsTo<typeof Maintenance>

  @belongsTo ( ()=> Part)
  public parts: BelongsTo<typeof Part>
}
