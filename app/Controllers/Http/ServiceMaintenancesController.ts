import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Maintenance from 'App/Models/Maintenance'
import OrderPart from 'App/Models/OrderPart'
import Part from 'App/Models/Part'
import PartCondition from 'App/Models/PartCondition'
import PartModel from 'App/Models/PartModel'
import Service from 'App/Models/Service'
import ServiceMaintenance from 'App/Models/ServiceMaintenance'
import { DateTime } from 'luxon'

export default class ServiceMaintenancesController {
  public async showServiceMaintenance({ view, params }: HttpContextContract) {
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
      vmodel_id: m.vehicles.vehiclemodel_id,
    }))


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

    const allparts = (await PartCondition.query().from('part_conditions').select('*')
    .preload('parts', (q) => {
      q.preload('part_brands', () => {})
    })).map((p) => ({
      id: p.id,
      part: p.parts.part_brands.partbrand +' '+ p.parts.partname,
      condition: p.condition,
      quantity: p.partquantity,
      price: p.price,
      describe: p.parts.partdescribe,
      part_id: p.parts.id,
    }))

    const part_model = await PartModel.query().select('part_id')
    .where('vehiclemodel_id', vehicle[0].vmodel_id)

    const parts = new Array()
    part_model.forEach(pmodel => {
      allparts.forEach(p => {
        if(p.part_id == pmodel.part_id) {
          parts.push(p)
        }
      })      
    });

    const order_parts = (await OrderPart.query().from('order_parts').select('*')
    .preload('service_maintenances', () => {})
    .preload('part_conditions', (q) => {
      q.preload('parts', (q) => {
        q.preload('part_brands', () => {})
      })
    })).map((o) => ({
      id: o.id,
      sid: o.service_maintenances.id,
      pid: o.part_conditions.id,
      order_date: o.order_date,
      part: o.part_conditions.parts.part_brands.partbrand +' '+ o.part_conditions.parts.partname,
      condition: o.part_conditions.condition,
      quantity: o.quantity,
      price: o.sell_price,
    }))

    let total_part_cost: {sid: number, cost: number}[] = new Array()
    for( let i=0; i < services.length; i++ ) {
      const order_part = (await OrderPart.query().from('order_parts')
      .select('sell_price')
      .where('service_maintenance_id', services[i].id)).map((o) => ({
        sid: o.service_maintenance_id,
        price: o.sell_price,
      }))
      total_part_cost[i] = { sid: services[i].id, cost: 0, }

      for( let j=0; j < order_part.length; j++ ) {
        total_part_cost[i].cost += order_part[j].price
      }      
    }

    const service_maintenance = services.map((s) => ({
      id: s.id,
      service: s.services.service,
      cost: s.services.cost,
    }))
    
    return view.render('service_maintenance', {
      feature: 'Maintenance Services',
      vehicle: vehicle,
      services: await Service.all(),
      service_maintenance: service_maintenance,
      parts: parts,
      order_part: order_parts,
      status: maintenance[0].status,
      mid: maintenance[0].id,
      total_part_cost: total_part_cost,
      pmodal: params.pmodal,
    })
  }

  public async addServiceMaintenance({ params, response }: HttpContextContract) {
    const services = await ServiceMaintenance.query().from('service_maintenances')
    .select('*')
    .where('maintenance_id', params.mid)
    .preload('services', () => {})
    .preload('maintenances', () => {})

    let url = "/service/" + params.mid;

    for( let i=0; i < services.length; i++ ) {
      if(services[i].services.service == params.service) {
        url = "/service/" + params.mid + "/duplicateService";
      }
    }

    if(url == ("/service/" + params.mid)) {
      const service_maintenance = new ServiceMaintenance()
      await service_maintenance.fill({
        maintenance_id: params.mid,
        service_id: (await Service.findByOrFail('service', params.service)).id,
      }).save()
      console.log("service maintenance: " + service_maintenance.$isPersisted)
      const maintenance = await Maintenance.findOrFail(params.mid)
      maintenance.status = 'In progress'
      await maintenance.save()
    }
    response.redirect(url) 
  }

  public async deleteServiceMaintenance({ params, response }: HttpContextContract) {
    const service_maintenance = await ServiceMaintenance.findOrFail(params.id)
    const order_part = await OrderPart.query().where('service_maintenance_id', service_maintenance.id)
    .preload('part_conditions', (q) => {
      q.preload('parts', () => {})
    })
    for( let i=0; i < order_part.length; i++ ) {
      order_part[i].part_conditions.parts.partquantity += order_part[i].quantity
      await order_part[i].part_conditions.parts.save()
      order_part[i].part_conditions.partquantity += order_part[i].quantity
      await order_part[i].part_conditions.save()
    }
    await service_maintenance?.delete()
    response.redirect('/service/' + params.mid)
  }

  public async addOrderPart({ params, response, request }: HttpContextContract) {
    const parts = await OrderPart.query().from('order_parts')
    .select('part_condition_id')
    .where('service_maintenance_id', params.sid)

    let url = "/service/" + params.mid;
    
    for( let i=0; i < parts.length; i++ ) {
      if(parts[i].part_condition_id == params.pid) {
        url = "/service/" + params.mid + "/duplicatePart";
      }
    }

    if(url == ("/service/" + params.mid)) {
      const part_condition = await PartCondition.findOrFail(params.pid)
      const order_part = new OrderPart()
      await order_part.fill({
        service_maintenance_id: params.sid,
        part_condition_id: params.pid,
        order_date: DateTime.now(),
        quantity: request.all().quantity,
        sell_price: part_condition.price*request.all().quantity,
      }).save()
      console.log("order part: "+ order_part.$isPersisted)
      
      const part = await Part.findOrFail(part_condition.part_id)      
      part.partquantity -= order_part.quantity
      await part.save()
      console.log("update quantity part: "+part.$isPersisted)

      part_condition.partquantity -= order_part.quantity
      await part_condition.save()
      console.log("update quantity part_condition: "+part_condition.$isPersisted)
    }
    
    response.redirect(url)
  }

  public async deleteOrderPart({ params, response }: HttpContextContract) {
    const order_part = await OrderPart.findOrFail(params.id)
    const part_condition = await PartCondition.findOrFail(order_part.part_condition_id)
    const part = await Part.findOrFail(part_condition.part_id)

    part.partquantity += order_part.quantity
    await part.save()
    console.log("update quantity part: "+part.$isPersisted)

    part_condition.partquantity += order_part.quantity
    await part_condition.save()
    console.log("update quantity part_condition: "+part_condition.$isPersisted)

    await order_part?.delete()
    response.redirect('/service/' + params.mid)
  }

  public async updateOrderPart({ params, request, response }: HttpContextContract) {
    const order_part = await OrderPart.findOrFail(params.id)
    const part_condition = await PartCondition.findOrFail(order_part.part_condition_id)
    const part = await Part.findOrFail(part_condition.part_id)

    part.partquantity += order_part.quantity
    part.partquantity -= parseInt(request.all().quantity)
    await part.save()
    console.log("update quantity part: "+part.$isPersisted)

    part_condition.partquantity += order_part.quantity
    part_condition.partquantity -= parseInt(request.all().quantity)
    await part_condition.save()
    console.log("update quantity part_condition: "+part_condition.$isPersisted)

    
    order_part.order_date = DateTime.now()
    order_part.quantity = parseInt(request.all().quantity)
    order_part.sell_price = parseInt(request.all().quantity) * part_condition.price
    await order_part.save()
    console.log("update order_part: "+order_part.$isPersisted)

    response.redirect('/service/' + params.mid)
  }
}
