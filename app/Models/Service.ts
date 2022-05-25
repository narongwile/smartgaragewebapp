import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import ServiceMaintenance from './ServiceMaintenance'

export default class Service extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public service: string

  @column()
  public cost: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => ServiceMaintenance)
  public service_maintenances: HasMany<typeof ServiceMaintenance>
}
