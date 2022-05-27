import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Part from './Part'
import OrderPart from './OrderPart'

export default class PartCondition extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public part_id: number

  @column()
  public condition: string

  @column()
  public partquantity: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Part, {
    foreignKey: 'part_id'
  })
  public parts: BelongsTo<typeof Part>

  @hasMany(() => OrderPart)
  public order_parts: HasMany<typeof OrderPart>
}
