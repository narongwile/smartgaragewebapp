import Mail from '@ioc:Adonis/Addons/Mail'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Customer from 'App/Models/Customer'
import Maintenance from 'App/Models/Maintenance'
import Vehicle from 'App/Models/Vehicle'
import { DateTime } from 'luxon'
import otpGenerator from 'otp-generator'

export default class CustomersController {
  public async showCustomer({ view }: HttpContextContract) {
    const customer = await Database.from('customers').select('*').orderBy('id', 'asc')

    return view.render('customer_list', {
      feature: 'Customer List',
      customer: customer,
    })
  }

  public async showUpdate({ view, params }: HttpContextContract) {
    const id = params.id
    const customer = await Customer.find(id)

    return view.render('customer_update', {
      feature: 'Update',
      id: id,
      fname: customer?.fname,
      lname: customer?.lname,
      company: customer?.company,
      customer_tax_id: customer?.customer_tax_id,
      address: customer?.address,
      tel: customer?.tel,
      email: customer?.email,
    })
  }

  public async update({ params, request, response }: HttpContextContract) {
    console.log(request.all())
    const customer = await Customer.findOrFail(params.id)
    customer.fname = request.all().fname
    customer.lname = request.all().lname
    customer.company = request.all().company
    customer.customer_tax_id = request.all().customer_tax_id
    customer.address = request.all().address
    customer.tel = request.all().tel
    customer.email = request.all().email

    await customer.save()

    console.log(customer.$isPersisted)

    response.redirect('/customer_list')
  }

  public async delete({ params, response }: HttpContextContract) {
    console.log(params)
    const id = params.id
    const customer = await Customer.find(id)
    await customer?.delete()

    response.redirect('/customer_list')
  }

  public showLogin({ view }: HttpContextContract) {
    return view.render('customer/login')
  }

  public async sendEmail({ view, request, response, session }: HttpContextContract) {
    const email = request.input('email')

    const customer = await Customer.findBy('email', email)
    if (customer == null) {
      session.flash('notification', "We couldn't verify your email.")
      return response.redirect('back')
    }
    const password = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    })

    console.log(
      await Mail.send((message) => {
        message
          .from('SmartGarage@smartgarage.tk')
          .to(customer.email)
          .subject('SmartGarage, Password for customer service')
          .html(
            '<h1> Hello, ' +
              customer.fname +
              ' ' +
              customer.lname +
              '</h1><br>' +
              '<p> Password: ' +
              password +
              ' </p><hr>' +
              '<p><a href="smartgarage.tk">Click to Smartgarage Customer Service</a></p>'
          )
      })
    )

    return view.render('customer/login', {
      email: email,
      password: password,
      message: 'Check your mail, we have sent a password to your email.',
    })
  }

  public async vehicleCustomer({ view, request }: HttpContextContract) {
    const customer = await Customer.findByOrFail('email', request.input('email'))
    const vehicle = (
      await Vehicle.query()
        .where('customer_id', customer.id)
        .preload('vehicle_models', (q) => {
          q.preload('vehicle_brands', () => {})
        })
    ).map((v) => ({
      id: v.id,
      license_id: v.license_id,
      model: v.vehicle_models.vehicle_brands.vehicle_brand + ' ' + v.vehicle_models.vehicle_model,
      colour: v.colour,
    }))

    return view.render('customer/vehicle', {
      customer: customer.fname + ' ' + customer.lname,
      vehicle: vehicle,
    })
  }

  public async vehicleMaintenance({ view, params }: HttpContextContract) {
    const maintenance = (
      await Maintenance.query()
        .where('vehicle_id', params.id)
        .orderBy('id', 'desc')
        .preload('employees', () => {})
        .preload('receipts', () => {})
        .preload('service_maintenances', (q) => {
          q.preload('services', () => {}),
          q.preload('order_parts', () => {})
        })
    ).map((m) => ({
      id: m.id,
      status: m.status,
      start: m.start_date.toLocaleString(),
      finish: m.status == 'Cancel' ? '-' : m.end_date == null ? 'pending' : m.end_date.toLocaleString(),
      comment: m.comment == null || m.comment == '' ? 'No comment' : m.comment,
      technical: m.employees.fname + ' ' + m.employees.lname,
      ttel: m.employees.tel,
      cost: m.receipt_id == null ? 'pending' : m.receipts.cost,
      service: m.service_maintenances,
    }))

    let mcost = new Array()
    for( let i=0; i < maintenance.length; i++ ) {
      mcost[i] = 0
      for( let j=0; j < maintenance[i].service.length; j++ ) {
        mcost[i] += maintenance[i].service[j].services.cost
        for( let k=0; k < maintenance[i].service[j].order_parts.length; k++ ) {
          mcost[i] += maintenance[i].service[j].order_parts[k].sell_price
        }
      }
      if(mcost[i] != 0) {
        maintenance[i].cost = '฿'+mcost[i].toLocaleString()
      }
      if(maintenance[i].status == 'Cancel') {
        maintenance[i].cost = '-'
      }
    }

    const vehicle = (
      await Vehicle.query()
        .where('id', params.id)
        .preload('customers', () => {})
        .preload('vehicle_models', (q) => {
          q.preload('vehicle_brands', () => {})
        })
    ).map((v) => ({
      customer: v.customers.fname + ' ' + v.customers.lname,
      license_id: v.license_id,
      model: v.vehicle_models.vehicle_brands.vehicle_brand + ' ' + v.vehicle_models.vehicle_model,
      colour: v.colour,
    }))

    return view.render('customer/maintenance', {
      customer: vehicle[0].customer,
      vehicle: vehicle,
      maintenance: maintenance,
    })
  }

  public async serviceMaintenance({ params, view }: HttpContextContract) {
    const maintenance = (await Maintenance.query().where('id', params.id)
    .preload('vehicles', (q) => {
      q.preload('vehicle_models', (q) => {
        q.preload('vehicle_brands', () => {})
      }).preload('customers', () => {})
    }).preload('employees', () => {})
    .preload('receipts', () => {})
    .preload('service_maintenances', (q) => {
      q.preload('services', () => {})
      .preload('order_parts', (q) => {
        q.preload('part_conditions', (q) => {
          q.preload('parts', (q) => {
            q.preload('part_brands', () => {})
          })
        })
      })
    })).map((m) => ({
      technical: m.employees.fname +' '+ m.employees.lname,
      ttel: m.employees.tel,
      comment: m.comment == null || m.comment == '' ? 'No comment' : m.comment,
      customer: m.vehicles.customers.fname +' '+ m.vehicles.customers.lname,
      vname: m.vehicles.vehicle_models.vehicle_brands.vehicle_brand +' '+ 
      m.vehicles.vehicle_models.vehicle_model +' '+ m.vehicles.license_id,
      vcolour: m.vehicles.colour,
      status: m.status,
      start: m.start_date.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY),
      finish: m.end_date == null ? 'Pending' : m.end_date.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY),
      payment: m.receipt_id == null ? m.status : m.receipts.payment_date.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY),
      cancel: m.status == 'Cancel' ? m.updatedAt : null,
      sm: m.service_maintenances,
    }))
    const service = maintenance[0].sm.map((s) => ({
      id: s.id,
      sname: s.services.service,
      scost: s.services.cost,
      parts: s.order_parts,
    }))
    const parts = new Array()
    for( let i=0; i < service.length; i++ ) {
      parts[i] = service[i].parts.map((p) => ({
        id: p.service_maintenance_id,
        order: p.order_date.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY),
        pname: p.part_conditions.parts.part_brands.partbrand 
        +' '+ p.part_conditions.parts.partname,
        condition: p.part_conditions.condition,
        pprice: p.part_conditions.price,
        quantity: p.quantity,
        price: p.sell_price,
      }))
    } console.log(parts)
    return view.render('customer/details', {
      customer: maintenance[0].customer,
      maintenance: maintenance,
      service: service,
      parts: parts,
    })
  }
}
