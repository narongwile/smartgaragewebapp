import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import Database from '@ioc:Adonis/Lucid/Database'
import Part from 'App/Models/Part'
import PartBrand from 'App/Models/PartBrand'
import PartType from 'App/Models/PartType'
import Stock from 'App/Models/Stock'

export default class PartsController {
    public async showAutoParts({ view, request, response }: HttpContextContract) {

        // const fs = require('fs')

        // const rawdata = fs.readFileSync('resources/json/autoparts.json')
        // const part_type = JSON.parse(rawdata)

        //const engine = part_type.find(item => item.vehiclePart == 'Engine').vehicleSubPart

        // const part_brand = new Part()
        // await part_brand.fill({  
        //     partbrand_id: 2,
        //     parttype_id: 1,
        //     partname: 'asdsad', 
        //     partdescribe: 'asdasd' }).save()
        // console.log(part_brand.$isPersisted)


        // try {
        //     const part_type_search = await PartType.findBy('parttype', request.input('parttype'))

        //     const part = await Part.findBy('parttype_id', part_type_search?.id)

        //     console.log(part)

        // } catch (error) {
        //     console.log(error)
        //     return response.redirect('/')
        // }



        // for (let i = 0; i < engine.length; i++) {
        //     console.log(engine[i])
        // }

        //console.log(student.find(item => item.brand == 'Honda')) 
        
        
        //const part = await PartBrand.query().has('parts')

        const part = await Database.from('parts').select('*').orderBy('id', 'asc')
        const part_brand = await PartBrand.all()
        const part_type = await PartType.all()
        const stock = await Stock.all()
        let total_qty = 0
        let arr_qty:number[] = new Array(part.length)
        console.log(arr_qty)
        console.log('+++++++++++++++++++++++++++++++++++++')

        // for(var s in stock){
        //     console.log(s.length)
        // }
        for(let j=0; j< part.length; j++){
            for(let i=0; i < stock.length; i++){
                if(stock[i].part_id == part[j].id){
                    total_qty += stock[i].qty_in_stock
                    console.log(stock[i].qty_in_stock)

                }
                
            }
            arr_qty.push(total_qty)
            
            
        }
        console.log(arr_qty)
        console.log(arr_qty.length)
        console.log(arr_qty[29])

        

        return view.render('part_list', { 
            part: part, 
            part_type: part_type, 
            part_brand: part_brand,
            stock: stock,
            total_qty: total_qty,
            feature: 'Auto Part List'
         })
    }

    public async addPart({ request, view }: HttpContextContract) {
        console.log(request.all())

        const part = new Part()
        await part.fill({
            partbrand_id: request.all().partbrand_id,
            parttype_id: request.all().parttype_id,
            partname: request.all().partname,
            partdescribe: request.all().partdescribe
        }).save()
        console.log(part.$isPersisted)
        
        const part_brand = await PartBrand.find(request.all().partbrand_id)
        const part_type = await PartType.find(request.all().parttype_id)

        // const validationSchema = schema.create({
        //     partbrand: schema.number(),
        //     parttype: schema.number(),
        //     partname: schema.string({ trim: true }, [
        //         rules.unique({ table: 'parts', column: 'partname' }),
        //     ]),
        //     partdescribe: schema.string({ trim: true }),

        // })
        // const validatedData = await request.validate({ schema: validationSchema })


        // const part = await Part.create(validatedData)
        // console.log(part)
        // await part.load('part_brands')

        // console.log(part.$isPersisted)
        console.log(part_brand)

        return view.render('stock_add', { 
            part: part, 
            part_brand: part_brand,
            isFromAddPart: true,
            feature: 'Stock' 
        })
    }

    public async showAddPart({ view }: HttpContextContract) {
        const part_brand = await Database.from('part_brands').select('*').orderBy('partbrand', 'asc')
        const part_type = await Database.from('part_types').select('*').orderBy('parttype', 'asc')

        return view.render('part_add', { 
            part_brand: part_brand, 
            part_type: part_type, 
            feature: 'Add ' 
        })
    }

    public async addStock({ request, view }: HttpContextContract){
        console.log(request.all())

        const add_stock = new Stock()

        await add_stock.fill({
            part_id: request.all().partid,
            instock_date: request.all().instockdate,
            warranty_date: request.all().warrantydate,
            buy_price: request.all().buyprice,
            condition: request.all().condition,
            product_year: request.all().productyear,
            qty_in_stock: request.all().qtyinstock,
        }).save()
        console.log(add_stock.$isPersisted)

        const part = await Part.all()
        const part_brand = await PartBrand.all()
        const stock = await Database.from('stocks').select('*').orderBy('created_at', 'desc')
        const part_type = await PartType.all()

        return view.render('stock_list', { 
            part: part,
            part_brand: part_brand,
            part_type: part_type,
            stock: stock,
            feature: 'Stock List' 
        })
    }

    public async showAddStock({ view }: HttpContextContract) {
        const part = await Database.from('parts').select('*').orderBy('id', 'asc')
        const part_brand = await PartBrand.all()

        return view.render('stock_add', { 
            part: part, 
            part_brand: part_brand,
            isFromAddPart: false, 
            feature: 'Stock ' 
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

