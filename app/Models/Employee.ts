import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column, computed, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import Maintenance from './Maintenance'

export default class Employee extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public fname: string

  @column()
  public lname: string

  @column()
  public tel: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password:  string

  @column()
  public department:  string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (user: Employee) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @hasMany( ()=> Maintenance)
  public maintenances:  HasMany<typeof Maintenance>

}
