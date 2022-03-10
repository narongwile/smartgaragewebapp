import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Part from 'App/Models/Part'
import PartBrand from 'App/Models/PartBrand'
import PartType from 'App/Models/PartType'
import Stock from 'App/Models/Stock'

export default class InventoriesController {
  public async addStock({ request, view }: HttpContextContract) {
    console.log(request.all())

    const add_stock = new Stock()

    await add_stock
      .fill({
        part_id: request.all().partid,
        instock_date: request.all().instockdate,
        warranty_date: request.all().warrantydate,
        buy_price: request.all().buyprice,
        condition: request.all().condition,
        product_year: request.all().productyear,
        qty_in_stock: request.all().qtyinstock,
      })
      .save()
    console.log(add_stock.$isPersisted)

    const update_part = await Part.findOrFail(request.all().partid)
    update_part.partquantity += parseInt(request.all().qtyinstock)
    await update_part.save()
    console.log(update_part.$isPersisted)

    const part = await Part.all()
    const part_brand = await PartBrand.all()
    const stock = await Database.from('stocks').select('*').orderBy('created_at', 'desc')
    const part_type = await PartType.all()

    return view.render('stock_list', {
      part: part,
      part_brand: part_brand,
      part_type: part_type,
      stock: stock,
      feature: 'Stock List',
    })
  }

  public async showAddStock({ view }: HttpContextContract) {
    const part = await Database.from('parts').select('*').orderBy('id', 'asc')
    const part_brand = await PartBrand.all()

    return view.render('stock_add', {
      part: part,
      part_brand: part_brand,
      isFromAddPart: false,
      feature: 'Stock ',
    })
  }

  public async showStock({ view }: HttpContextContract) {
    const part = await Part.all()
    // const part = await Database.from('parts').select('*').orderBy('id', 'asc')
    const part_brand = await PartBrand.all()
    const stock = await Database.from('stocks').select('*').orderBy('created_at', 'desc')
    const part_type = await PartType.all()

    console.log(stock)

    return view.render('stock_list', {
      part: part,
      part_brand: part_brand,
      part_type: part_type,
      stock: stock,
      feature: 'Stock List',
    })
  }
}
