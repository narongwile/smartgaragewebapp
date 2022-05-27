import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Customer from 'App/Models/Customer'
import Maintenance from 'App/Models/Maintenance'
import OrderPart from 'App/Models/OrderPart'
import ServiceMaintenance from 'App/Models/ServiceMaintenance'
import Vehicle from 'App/Models/Vehicle'

export default class ServiceMaintenancesController {
  public async showServiceMaintenance({ view, params }: HttpContextContract) {
    const services = await ServiceMaintenance.query()
      .from('service_maintenances')
      .select('*')
      .where('maintenance_id', params.id)
      .preload('services', () => {})
      .preload('order_parts', (q) => {
        q.preload('part_conditions', (q) => {
          q.preload('parts', (q) => {
            q.preload('part_brands', () => {})
          })
        })
      })

    const service = services.map((s) => ({
      id: s.id,
      service: s.services.service,
      cost: s.services.cost,
    }))

    let part = new Array()
    for (let i = 0; i < service.length; i++) {
      const parts = await OrderPart.query()
        .from('order_parts')
        .select('*')
        .where('service_maintenance_id', service[i].id)
        .preload('part_conditions', (q) => {
          q.preload('parts', (q) => {
            q.preload('part_brands', () => {})
          })
        })

      for (let j = 0; j < parts.length; j++) {
        part[i] = parts.map((p) => ({
          part:
            p.part_conditions.parts.part_brands.partbrand + ' ' + p.part_conditions.parts.partname,
          condition: p.part_conditions.condition,
          order_date: p.order_date,
          quantity: p.quantity,
          price: p.sell_price,
        }))
      }
    }

    const maintenance = await Maintenance.query()
      .from('maintenances')
      .select('*')
      .where('id', params.id)
      .preload('vehicles', (q) => {
        q.preload('customers', () => {})
        q.preload('vehicle_models', (q) => {
          q.preload('vehicle_brands', () => {})
        })
      })

    const vehicle = maintenance.map((m) => ({
      license_id: m.vehicles.license_id,
      colour: m.vehicles.colour,
      model:
        m.vehicles.vehicle_models.vehicle_brands.vehicle_brand +
        ' ' +
        m.vehicles.vehicle_models.vehicle_model,
      customer: m.vehicles.customers.fname + ' ' + m.vehicles.customers.lname,
      tel: m.vehicles.customers.tel,
    }))

    console.log(service)
    console.log('***********************************************')
    console.log(vehicle)
    console.log('***********************************************')
    console.log(part)
    return view.render('service_maintenance', {
      feature: 'Maintenance Services',
      vehicle: vehicle,
      service: service,
      part: part,
      status: maintenance[0].status,
      mid: maintenance[0].id,
    })
  }
}
