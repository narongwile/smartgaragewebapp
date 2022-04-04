import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Garage from 'App/Models/Garage'

export default class GaragesController {
    public async update({ request, response }: HttpContextContract) {
        console.log(request.all())
        const garage = await Garage.findOrFail(1)
        garage.company_th = request.all().company_th
        garage.company_en = request.all().company_en
        garage.email = request.all().email
        garage.tel = request.all().tel
        garage.tax_id = request.all().taxid
        garage.address = request.all().address

        await garage.save()
        console.log(garage.$isPersisted)

        response.redirect('/garage_profile')
    }
}
