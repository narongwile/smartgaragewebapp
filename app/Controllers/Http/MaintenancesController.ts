import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Maintenance from 'App/Models/Maintenance'
import OrderPart from 'App/Models/OrderPart'
import Receipt from 'App/Models/Receipt'
import ServiceMaintenance from 'App/Models/ServiceMaintenance'
import { DateTime } from 'luxon'
import puppeteer from 'puppeteer'

export default class MaintenancesController {
  public async pendingPaymentStatus({ response, params, request }: HttpContextContract) {
    const maintenance = await Maintenance.findOrFail(params.id)
    maintenance.status = 'Pending payment'
    maintenance.end_date = DateTime.now()
    maintenance.comment = request.all().comment
    await maintenance.save()
    response.redirect('/maintenance')
  }

  public async successStatus({ response, params }: HttpContextContract) {
    let total_cost = 0
    const service_maintenance = await ServiceMaintenance.query().where('maintenance_id', params.id)
    .preload('services', () => {})
    .preload('order_parts', () => {})

    for( let i=0; i < service_maintenance.length; i++ ) {
      total_cost += service_maintenance[i].services.cost
      for( let j=0; i < service_maintenance[i].order_parts.length; j++ ) {
        total_cost += service_maintenance[i].order_parts[j].sell_price
      }
    }

    const receipt = new Receipt()
    await receipt.fill({
      payment_date: DateTime.now(),
      cost: total_cost,
    }).save()

    const maintenance = await Maintenance.findOrFail(params.id)
    maintenance.status = 'Success'
    maintenance.receipt_id = receipt.id
    await maintenance.save()
    response.redirect('/maintenance')
  }

  public async cancelStatus({ response, params, request }: HttpContextContract) {
    const maintenance = await Maintenance.findOrFail(params.id)
    const service_maintenance = await ServiceMaintenance.query()
    .where('maintenance_id', params.id)
    
    for(let i=0; i < service_maintenance.length; i++) {
      const order_part = await OrderPart.query()
      .where('service_maintenance_id', service_maintenance[i].id)
      .preload('part_conditions', (q) => {
        q.preload('parts', () => {})
      })
      for( let i=0; i < order_part.length; i++ ) {
        order_part[i].part_conditions.parts.partquantity += order_part[i].quantity
        await order_part[i].part_conditions.parts.save()
        order_part[i].part_conditions.partquantity += order_part[i].quantity
        await order_part[i].part_conditions.save()
      }
      await service_maintenance[i].delete()
    }
    maintenance.status = 'Cancel'
    maintenance.comment = request.all().comment
    await maintenance.save()
    response.redirect('/maintenance')
  }

  public async generateHtmlToPdf() {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    // 1. Create PDF from URL
    // await page.goto('https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pdf')
    // await page.pdf({ path: 'api.pdf', format: 'A4' })

    // 2. Create PDF from static HTML
    const htmlContent = `<body>
  <h1>An example static HTML to PDF</h1>
  </body>`
    await page.setContent(htmlContent)
    await page.pdf({ path: 'html.pdf', format: 'A4' })

    await browser.close()
  }
}
