import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Part from './Part'
import VehicleModel from './VehicleModel'

export default class PartModel extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public vehiclemodel_id: number

  @column()
  public part_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo( ()=> Part)
  public parts: BelongsTo<typeof Part>

  @belongsTo( ()=> VehicleModel)
  public vehicle_models:  BelongsTo<typeof VehicleModel>
}
