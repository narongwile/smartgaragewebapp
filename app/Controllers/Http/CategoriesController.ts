import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import PartBrand from 'App/Models/PartBrand'
import PartType from 'App/Models/PartType'
import VehicleBrand from 'App/Models/VehicleBrand'
import VehicleModel from 'App/Models/VehicleModel'
import Service from 'App/Models/Service'

export default class CategoriesController {
  public async showPartBrandType({ view }: HttpContextContract) {
    const partbrands = await PartBrand.all()
    const parttypes = await PartType.all()

    return view.render('part_brandtype', {
      feature: 'Auto Part Brand&Type',
      partbrands: partbrands,
      parttypes: parttypes,
    })
  }

  public async showAddPartBrand({ view }: HttpContextContract) {
    return view.render('part_brand_add', {
      feature: 'Add',
    })
  }

  public async addPartBrand({ request, response }: HttpContextContract) {
    const partbrand = new PartBrand()
    await partbrand.fill({ partbrand: request.all().partbrand }).save()

    console.log(partbrand.$isPersisted)
    response.redirect('/part_brandtype')
  }

  public async showUpdatePartBrand({ view, params }: HttpContextContract) {
    const part_brand = await PartBrand.find(params.id)

    return view.render('part_brand_update', {
      feature: 'Update',
      part_brand: part_brand?.partbrand,
      id: params.id,
    })
  }

  public async updatePartBrand({ request, response }: HttpContextContract) {
    console.log(request.all())
    const partbrand = await PartBrand.findOrFail(request.all().id)
    partbrand.partbrand = request.all().partbrand

    await partbrand.save()

    console.log(partbrand.$isPersisted)

    response.redirect('/part_brandtype')
  }

  public async deletePartBrand({ params, response }: HttpContextContract) {
    console.log(params)
    const id = params.id
    const partbrand = await PartBrand.find(id)
    await partbrand?.delete()

    response.redirect('/part_brandtype')
  }

  public async showAddPartType({ view }: HttpContextContract) {
    return view.render('part_type_add', {
      feature: 'Add',
    })
  }

  public async addPartType({ request, response }: HttpContextContract) {
    const parttype = new PartType()
    await parttype.fill({ parttype: request.all().parttype }).save()

    console.log(parttype.$isPersisted)
    response.redirect('/part_brandtype')
  }

  public async showUpdatePartType({ view, params }: HttpContextContract) {
    const id = params.id
    const part_type = await PartType.find(id)

    return view.render('part_type_update', {
      feature: 'Update',
      part_type: part_type?.parttype,
      id: id,
    })
  }

  public async updatePartType({ request, response }: HttpContextContract) {
    console.log(request.all())
    const parttype = await PartType.findOrFail(request.all().id)
    parttype.parttype = request.all().parttype

    await parttype.save()

    console.log(parttype.$isPersisted)

    response.redirect('/part_brandtype')
  }

  public async deletePartType({ params, response }: HttpContextContract) {
    console.log(params)
    const id = params.id
    const parttype = await PartType.find(id)
    await parttype?.delete()

    response.redirect('/part_brandtype')
  }

  public async showAddVehicleBrand({ view }: HttpContextContract) {
    return view.render('vehicle_brand_add', {
      feature: 'Add',
    })
  }

  public async addVehicleBrand({ response, request }: HttpContextContract) {
    const vehiclebrand = new VehicleBrand()
    await vehiclebrand.fill({ vehicle_brand: request.all().vehiclebrand }).save()

    response.redirect('/vehicle_model')
  }

  public async showUpdateVehicleBrand({ view, params }: HttpContextContract) {
    const vehiclebrand = await VehicleBrand.find(params.id)

    return view.render('vehicle_brand_update', {
      feature: 'Update',
      vehiclebrand: vehiclebrand?.vehicle_brand,
      id: params.id,
    })
  }

  public async updateVehicleBrand({ request, response }: HttpContextContract) {
    console.log(request.all())
    const vehiclebrand = await VehicleBrand.findOrFail(request.all().id)
    vehiclebrand.vehicle_brand = request.all().vehiclebrand

    await vehiclebrand.save()

    console.log(vehiclebrand.$isPersisted)

    response.redirect('/vehicle_model')
  }

  public async deleteVehicleBrand({ params, response }: HttpContextContract) {
    console.log(params)
    const vehiclebrand = await VehicleBrand.find(params.id)
    await vehiclebrand?.delete()

    response.redirect('/vehicle_model')
  }

  public async showAddVehicleModel({ params, view }: HttpContextContract) {
    const vehiclebrand = await Database.from('vehicle_brands').select('*').orderBy('id', 'asc')

    return view.render('vehicle_model_add', {
      feature: 'Add',
      vehiclebrand: vehiclebrand,
      vbid: params.id,
    })
  }

  public async addVehicleModel({ request, response }: HttpContextContract) {
    const vehiclemodel = new VehicleModel()
    await vehiclemodel
      .fill({
        vehiclebrand_id: request.all().vehiclebrandid,
        vehicle_model: request.all().vehiclemodel,
      })
      .save()

    response.redirect('/vehicle_model')
  }

  public async showVehicleModel({ view }: HttpContextContract) {
    const vehiclebrand = await Database.from('vehicle_brands').select('*').orderBy('id', 'asc')
    const vehiclemodel = await Database.from('vehicle_models').select('*').orderBy('id', 'asc')

    return view.render('vehicle_model', {
      feature: 'Vehicle Model',
      vehiclebrand: vehiclebrand,
      vehiclemodel: vehiclemodel,
    })
  }

  public async showUpdateVehicleModel({ view, params }: HttpContextContract) {
    const vehiclemodel = await VehicleModel.find(params.id)
    const vehiclebrand = await VehicleBrand.find(vehiclemodel?.vehiclebrand_id)

    return view.render('vehicle_model_update', {
      feature: 'Update',
      vehiclebrand: vehiclebrand?.vehicle_brand,
      vehiclemodel: vehiclemodel?.vehicle_model,
      id: params.id,
    })
  }

  public async updateVehicleModel({ request, response }: HttpContextContract) {
    console.log(request.all())
    const vehiclemodel = await VehicleModel.findOrFail(request.all().id)
    const vehiclebrand = await VehicleBrand.findByOrFail(
      'vehicle_brand',
      request.all().vehiclebrand
    )

    vehiclemodel.vehiclebrand_id = vehiclebrand.id
    vehiclemodel.vehicle_model = request.all().vehiclemodel

    await vehiclemodel.save()

    console.log(vehiclemodel.$isPersisted)

    response.redirect('/vehicle_model')
  }

  public async deleteVehicleModel({ params, response }: HttpContextContract) {
    console.log(params)
    const vehiclemodel = await VehicleModel.find(params.id)
    await vehiclemodel?.delete()

    response.redirect('/vehicle_model')
  }

  public async showService({ view }: HttpContextContract) {
    const services = await Database.from('services').select('*').orderBy('id', 'asc')

    return view.render('service_list', {
      feature: 'Services',
      services: services,
    })
  }

  public async showAddService({ view }: HttpContextContract) {
    return view.render('service_add', {
      feature: 'Add Service',
    })
  }

  public async addService({ request, response }: HttpContextContract) {
    console.log({ request })

    const service = new Service()
    await service
      .fill({
        service: request.all().service,
        cost: request.all().cost,
      })
      .save()

    response.redirect('/service_list')
  }

  public async showUpdateService({ view, params }: HttpContextContract) {
    const service = await Service.find(params.id)

    return view.render('service_update', {
      feature: 'Update Service',
      service: service?.service,
      cost: service?.cost,
      id: params.id,
    })
  }

  public async updateService({ request, response, params }: HttpContextContract) {
    const service = await Service.findOrFail(params.id)
    service.service = request.all().service
    service.cost = request.all().cost
    await service.save()

    response.redirect('/service_list')
  }

  public async deleteService({ params, response }: HttpContextContract) {
    const service = await Service.findOrFail(params.id)
    await service?.delete()

    response.redirect('/service_list')
  }
}
