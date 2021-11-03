import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import View from '@ioc:Adonis/Core/View'
import Part from 'App/Models/Part'
import PartBrand from 'App/Models/PartBrand'
import PartType from 'App/Models/PartType'

export default class PartsController {
    public async showAutoParts({ view, request, response }: HttpContextContract) {

        const fs = require('fs')

        const rawdata = fs.readFileSync('resources/json/autoparts.json')
        const part_type = JSON.parse(rawdata)

        const engine = part_type.find(item => item.vehiclePart == 'Engine').vehicleSubPart

        // const part_brand = new PartBrand()
        // await part_brand.fill({ partbrand: 'MANN - FILTER' }).save()
        // console.log(part_brand.$isPersisted)


        try {
            const part_type_search = await PartType.findBy('parttype', request.input('parttype'))

            const part = await Part.findBy('parttype_id', part_type_search?.id)
            
            console.log(part)

        } catch (error) {
            console.log(error)
            return response.redirect('/')
        }



        for (let i = 0; i < engine.length; i++) {
            console.log(engine[i])
        }

        

        //console.log(student.find(item => item.brand == 'Honda'))            

        return view.render('parts', { part_type: part_type, parts: 'OKKKKK' })
    }

    public async stock({ view, request }: HttpContextContract) {


        return view.render('stock')
    }
}

