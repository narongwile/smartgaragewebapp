import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import VehicleBrand from './VehicleBrand'
import PartModel from './PartModel'

export default class VehicleModel extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public vehiclebrand_id: number

  @column()
  public vehicle_model: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo( ()=> VehicleBrand, {
    foreignKey: 'vehiclebrand_id'
  })
  public vehicle_brands:  BelongsTo<typeof VehicleBrand>

  @hasMany( ()=> PartModel)
  public part_models: HasMany<typeof PartModel>

  @hasMany( ()=> VehicleModel)
  public vehicle_models:  HasMany<typeof VehicleModel>
}
