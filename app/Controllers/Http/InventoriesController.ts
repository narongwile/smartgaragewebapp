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

  public async showAddStock({ params, view }: HttpContextContract) {
    const part = await Database.from('parts').select('*').orderBy('id', 'asc')
    const part_brand = await PartBrand.all()
    let part_sfl, partbrand_sfl

    if(params.id != null) {
      part_sfl = await Part.findOrFail(params.id)
      partbrand_sfl = await PartBrand.findOrFail(part_sfl.partbrand_id)
    }
    
    return view.render('stock_add', {
      part: part,
      part_brand: part_brand,
      isFromAddPart: false,
      psfl_id: (params.id != null) ? part_sfl.id : null,
      psfl_name: (params.id != null) ? part_sfl.partname : null,
      psfl_partbrand: (params.id != null) ? partbrand_sfl.partbrand : null,
      feature: 'Stock ',
    })
  }

  public async showStock({ view }: HttpContextContract) {
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

  public async showUpdate({ view, params }: HttpContextContract) {
    const stock = await Stock.find(params.id)
    const part = await Part.find(stock?.part_id)
    const part_brand = await PartBrand.find(part?.partbrand_id)

    return view.render('stock_update', {
      feature: 'Update',
      pid: part?.id,
      partname: part?.partname,
      partbrand: part_brand?.partbrand,
      stock: stock,
      stockOn: stock?.instock_date.toFormat("DD/MM/YYYY")
    })
  }

  public async update({ request, response }: HttpContextContract) {
    const stock = await Stock.findOrFail(request.all().id)
    const qty_stock = stock.qty_in_stock

    stock.instock_date = request.all().instockdate
    stock.warranty_date = request.all().warrantydate
    stock.condition = request.all().condition
    stock.product_year = request.all().productyear
    stock.buy_price = request.all().buyprice
    stock.qty_in_stock = request.all().qtyinstock

    await stock.save()
    console.log('quantity stock: '+stock.$isPersisted)

    const part = await Part.findOrFail(stock.part_id)    
    part.partquantity -= qty_stock
    part.partquantity += parseInt(request.all().qtyinstock)
    await part.save()
    console.log('quantity part: '+part.$isPersisted)

    response.redirect('/stock_list')
  }
  public async delete({ params, response }: HttpContextContract) {
    const stock = await Stock.findOrFail(params.id)
    const part = await Part.findOrFail(stock.part_id)

    part.partquantity -= stock.qty_in_stock
    await part.save()
    await stock?.delete()

    response.redirect('/stock_list')
  }
}
