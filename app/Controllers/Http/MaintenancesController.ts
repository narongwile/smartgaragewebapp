import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Customer from 'App/Models/Customer'
import Vehicle from 'App/Models/Vehicle'
import VehicleBrand from 'App/Models/VehicleBrand'
import VehicleModel from 'App/Models/VehicleModel'
import puppeteer from 'puppeteer'

export default class MaintenancesController {
  public async showMaintenances({ view }: HttpContextContract) {
    return view.render('maintenance', {
      feature: 'Maintenances',
    })
  }

  public async showCheckLicense({ view }: HttpContextContract) {
    return view.render('maintenance_check_vehicle', {
      feature: 'Vehicle Maintenance',
    })
  }

  public async checkLicense({ view, request, response }: HttpContextContract) {
    console.log(request.all())
    if (request.all().license_id == null || request.all().license_id == 'null')
      response.redirect('back')

    if ((await Vehicle.findBy('license_id', request.all().license_id)) == null) {
      const vmodel = await Database.from('vehicle_models')
        .select('*')
        .orderBy('vehicle_model', 'asc')
      const vbrand = await Database.from('vehicle_brands')
        .select('*')
        .orderBy('vehicle_brand', 'asc')
      const customer = await Database.from('customers').select('*').orderBy('fname', 'asc')
      return view.render('vehicle_add', {
        feature: 'Add Vehicle',
        license_id: request.all().license_id,
        v_brand: vbrand,
        v_model: vmodel,
        customer: customer,
      })
    } else {
      const vehicle = await Vehicle.findBy('license_id', request.all().license_id)
      const vmodel = await VehicleModel.find(vehicle?.vehiclemodel_id)
      const vbrand = await VehicleBrand.find(vmodel?.vehiclebrand_id)
      const customer = await Customer.find(vehicle?.customer_id)
      return view.render('maintenance_add', {
        feature: 'Add Maintenance',
        customer: customer?.fname + ' ' + customer?.lname,
        vbrand: vbrand?.vehicle_brand,
        vmodel: vmodel?.vehicle_model,
        vehicle: vehicle,
      })
    }
  }

  public async addVehicle({ request, view }: HttpContextContract) {
    console.log(request.all())

    if (!request.all().customer_id) {
      const customer = new Customer()
      await customer
        .fill({
          fname: request.all().fname,
          lname: request.all().lname,
          tel: request.all().tel,
          email: request.all().email,
          company: request.all().company,
          customer_tax_id: request.all().taxid,
          address: request.all().address,
          password: '1',
        })
        .save()
      console.log('customer: ' + customer.$isPersisted)

      const vehicle = new Vehicle()
      await vehicle
        .fill({
          customer_id: customer.id,
          vehiclemodel_id: request.all().vehiclemodel_id,
          license_id: request.all().license_id,
          colour: request.all().colour,
        })
        .save()
      console.log('vehicle: ' + vehicle.$isPersisted)
    } else {
      const vehicle = new Vehicle()
      await vehicle
        .fill({
          customer_id: request.all().customer_id,
          vehiclemodel_id: request.all().vehiclemodel_id,
          license_id: request.all().license_id,
          colour: request.all().colour,
        })
        .save()
      console.log('vehicle: ' + vehicle.$isPersisted)
    }
    return view.render('maintenance_add', {})
  }

  public async generateHtmlToPdf() {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    // 1. Create PDF from URL
    await page.goto('https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pdf')
    await page.pdf({ path: 'api.pdf', format: 'A4' })

    // 2. Create PDF from static HTML
    const htmlContent = `<body>
  <h1>An example static HTML to PDF</h1>
  </body>`
    await page.setContent(htmlContent)
    await page.pdf({ path: 'html.pdf', format: 'A4' })

    await browser.close()
  }
}
