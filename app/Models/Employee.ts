//import { DateTime } from 'luxon'
import { Hash } from '@adonisjs/hash/build/standalone'
import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'

export default class Employee extends BaseModel {
  @column({ isPrimary: true })
  public empid: number

  @column()
  public fname: string
  
  @column()
  public lname: string

  @column()
  public tel: string

  @column()
  public email: string

  @column({serializeAs: null, columnName: 'password'})
  public password: string

  @column()
  public dptid: number

  // @beforeSave()
  // public static async hashPassword (user: Employee) {
  //   if(user.$dirty.password){
  //     user.password = await Hash.apply(user.password)
  //   }
  // }
  
}
