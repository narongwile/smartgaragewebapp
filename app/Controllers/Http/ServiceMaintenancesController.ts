import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Maintenance from 'App/Models/Maintenance'
import OrderPart from 'App/Models/OrderPart'
import Part from 'App/Models/Part'
import PartCondition from 'App/Models/PartCondition'
import Service from 'App/Models/Service'
import ServiceMaintenance from 'App/Models/ServiceMaintenance'
import { DateTime } from 'luxon'

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
          id: p.id,
          part:
            p.part_conditions.parts.part_brands.partbrand + ' ' + p.part_conditions.parts.partname,
          condition: p.part_conditions.condition,
          order_date: p.order_date,
          quantity: p.quantity,
          price: p.sell_price,
        }))
      }
    }

    const parts = (await PartCondition.query().from('part_conditions').select('*')
    .preload('parts', (q) => {
      q.preload('part_brands', () => {})
      q.preload('stocks', () => {})
    })).map((p) => ({
      id: p.id,
      part: p.parts.part_brands.partbrand +' '+ p.parts.partname,
      condition: p.condition,
      quantity: p.partquantity,
      price: p.parts.stocks[0].buy_price,
    }))

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
    console.log(parts)
    return view.render('service_maintenance', {
      feature: 'Maintenance Services',
      vehicle: vehicle,
      services: await Service.all(),
      service: service,
      parts: parts,
      part: part,
      status: maintenance[0].status,
      mid: maintenance[0].id,
    })
  }

  public async addServiceMaintenance({ params, response }: HttpContextContract) {
    const service_maintenance = new ServiceMaintenance()
    await service_maintenance.fill({
      maintenance_id: params.mid,
      service_id: (await Service.findByOrFail('service', params.service)).id,
    }).save()
    console.log("service maintenance: " + service_maintenance.$isPersisted)
    response.redirect('/service/' + params.mid)
  }

  public async deleteServiceMaintenance({ params, response }: HttpContextContract) {
    const service_maintenance = await ServiceMaintenance.find(params.id)
    await service_maintenance?.delete()
    response.redirect('/service/' + params.mid)
  }

  public async addOrderPart({ params, response }: HttpContextContract) {
    const order_part = new OrderPart()
    await order_part.fill({
      service_maintenance_id: params.sid,
      part_condition_id: params.pid,
      order_date: DateTime.now(),
      quantity: params.quantity,
      sell_price: params.price,
    }).save()
    console.log("order part: "+ order_part.$isPersisted)
    response.redirect('/service/' + params.mid)
  }

  public async deleteOrderPart({ params, response }: HttpContextContract) {
    const order_part = await OrderPart.find(params.id)
    await order_part?.delete()
    response.redirect('/service/' + params.mid)
  }
}
