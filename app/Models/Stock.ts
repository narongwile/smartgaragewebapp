import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Part from './Part'

export default class Stock extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public part_id: number

  @column.dateTime()
  public instock_date: DateTime

  @column.dateTime()
  public warranty_date: DateTime

  @column()
  public buy_price: number

  @column()
  public condition: string

  @column()
  public product_year: string

  @column()
  public qty_in_stock: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Part)
  public parts: BelongsTo<typeof Part>
}
