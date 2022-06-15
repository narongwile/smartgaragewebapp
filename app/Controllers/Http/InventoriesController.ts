import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Part from 'App/Models/Part'
import PartBrand from 'App/Models/PartBrand'
import PartCondition from 'App/Models/PartCondition'
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

    const part_cdt = await PartCondition.query().where('part_id', request.all().partid).where('condition', request.all().condition)
    if( part_cdt[0] != null ) {      
      part_cdt[0].partquantity += parseInt(request.all().qtyinstock)
      part_cdt[0].price = parseInt(request.all().buyprice)
      await part_cdt[0] .save()
      console.log(part_cdt[0].$isPersisted)
    }else {
      const part_cdt = new PartCondition()
      await part_cdt.fill({
        part_id: request.all().partid,
        condition: request.all().condition,
        partquantity: request.all().qtyinstock,
        price: request.all().buyprice,
      }).save()
      console.log(part_cdt.$isPersisted)
    }

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

  public async update({ request, response, params }: HttpContextContract) {
    const stock = await Stock.findOrFail(params.id)
    const qty_stock = stock.qty_in_stock

    stock.instock_date = request.all().instockdate
    stock.warranty_date = request.all().warrantydate
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
    

    let condition
    if(params.condition == 'New%20Product') {
      condition = 'New Product'
      console.log(condition)
    }else if(params.condition == 'Used%20Product') {
      condition = 'Used Product'
      console.log(condition)
    }
    const part_cdt = await PartCondition.query().where('part_id', stock.part_id).where('condition', condition)
    .preload('parts', (q) => {
      q.preload('stocks', (q) => {
        q.select('id').where('condition', condition).orderBy('id', 'desc')
      })
    })
    console.log("Stock ID: "+part_cdt[0].parts.stocks.map((s) => ({ stock_id: s.id })))
    if(part_cdt[0].parts.stocks[0].id == stock.id) {
      part_cdt[0].price = stock.buy_price
      console.log("update price from stock id: "+part_cdt[0].parts.stocks[0].id)
    }
    part_cdt[0].partquantity -= qty_stock
    part_cdt[0].partquantity += parseInt(request.all().qtyinstock)
    await part_cdt[0].save()

    response.redirect('/stock_list')
  }

  public async delete({ params, response }: HttpContextContract) {
    const stock = await Stock.findOrFail(params.id)
    const part = await Part.findOrFail(stock.part_id)
    const part_cdt = await PartCondition.query().where('part_id', stock.part_id).where('condition', stock.condition)
    .preload('parts', (q) => {
      q.preload('stocks', (q) => {
        q.select('id', 'buy_price').where('condition', stock.condition).orderBy('id', 'desc')
      })
    })
    console.log("Stock ID: "+part_cdt[0].parts.stocks.map((s) => ({ stock_id: s.id })))
    if(part_cdt[0].parts.stocks[0].id == stock.id) {
      if(part_cdt[0].parts.stocks[1] != null) {}
      part_cdt[0].price = part_cdt[0].parts.stocks[1].buy_price
      console.log("update price from stock id: "+part_cdt[0].parts.stocks[1].id)
    }
    
    part_cdt[0].partquantity -= stock.qty_in_stock
    await part_cdt[0].save()

    part.partquantity -= stock.qty_in_stock
    await part.save()
    await stock?.delete()

    response.redirect('/stock_list')
  }
}
