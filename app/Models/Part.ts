import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, computed, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import PartBrand from './PartBrand'
import PartType from './PartType'
import OrderPart from './OrderPart'
import Stock from './Stock'
import PartModel from './PartModel'

export default class Part extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public partbrand_id:  number

  @column()
  public parttype_id: number

  @column()
  public partname:  string

  @column()
  public partdescribe:  string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo( ()=> PartBrand)
  public part_brands: BelongsTo<typeof PartBrand>

  @belongsTo( ()=> PartType)
  public part_types:  BelongsTo<typeof PartType>

  @hasMany( ()=> OrderPart)
  public order_parts: HasMany<typeof OrderPart>

  @hasMany( ()=> Stock)
  public stocks:  HasMany<typeof Stock>

  @hasMany( ()=> PartModel)
  public part_models: HasMany<typeof PartModel>

  @computed()
  public get partBrandName(){
    return this.part_brands.partbrand
  }
}
