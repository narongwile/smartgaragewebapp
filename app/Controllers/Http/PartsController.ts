import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Part from 'App/Models/Part'
import PartBrand from 'App/Models/PartBrand'
import PartModel from 'App/Models/PartModel'
import PartType from 'App/Models/PartType'

export default class PartsController {
  public async showAutoParts({ view }: HttpContextContract) {

    const part = await Database.from('parts').select('*').orderBy('id', 'asc')
    const part_brand = await PartBrand.all()
    const part_type = await PartType.all()
    
    return view.render('part_list', {
      part: part,
      part_type: part_type,
      part_brand: part_brand,
      feature: 'Auto Part List',
    })
  }

  public async addPart({ request, view }: HttpContextContract) {
    console.log(request.all())

    const part = new Part()
    await part
      .fill({
        partbrand_id: request.all().partbrand_id,
        parttype_id: request.all().parttype_id,
        partname: request.all().partname,
        partdescribe: request.all().partdescribe,
        partquantity: 0,
      })
      .save()
    console.log(part.$isPersisted)

    if( request.all().vehiclemodel_id != null ) {
      for(let i=0; i < request.all().vehiclemodel_id.length; i++ ) {
        if(request.all().vehiclemodel_id.length == 1) {
          const part_model = new PartModel()
          await part_model.fill({
            vehiclemodel_id: request.all().vehiclemodel_id,
            part_id: part.id,
          }).save()
          console.log("part model: "+part_model.$isPersisted)
        }else {
          const part_model = new PartModel()
          await part_model.fill({
            vehiclemodel_id: request.all().vehiclemodel_id[i],
            part_id: part.id,
          }).save()
          console.log("part model: "+part_model.$isPersisted)
        }        
      }
    }
    const part_brand = await PartBrand.find(request.all().partbrand_id)

    return view.render('stock_add', {
      part: part,
      part_brand: part_brand,
      isFromAddPart: true,
      feature: 'Stock',
    })
  }

  public async showAddPart({ view }: HttpContextContract) {
    const part_brand = await Database.from('part_brands').select('*').orderBy('partbrand', 'asc')
    const part_type = await Database.from('part_types').select('*').orderBy('parttype', 'asc')

    const vbrand = await Database.from('vehicle_brands').select('*').orderBy('vehicle_brand', 'asc')
    const vmodel = await Database.from('vehicle_models').select('*').orderBy('vehicle_model', 'asc')

    return view.render('part_add', {
      part_brand: part_brand,
      part_type: part_type,
      v_brand: vbrand,
      v_model: vmodel,
      feature: 'Add ',
    })
  }

  public async showUpdate({ view, params }: HttpContextContract) {
    const id = params.id
    const part = await Part.find(id)
    const part_brand = await PartBrand.find(part?.partbrand_id)
    const part_type = await PartType.find(part?.parttype_id)

    const pb = await Database.from('part_brands').select('*').orderBy('partbrand', 'asc')
    const pt = await Database.from('part_types').select('*').orderBy('parttype', 'asc')

    const vbrand = await Database.from('vehicle_brands').select('*').orderBy('vehicle_brand', 'asc')
    const vmodel = await Database.from('vehicle_models').select('*').orderBy('vehicle_model', 'asc')
    const part_model = await PartModel.query().where('part_id', id)
    console.log(part_model.length)

    return view.render('part_update', {
      feature: 'Update',
      part_brand: part_brand?.partbrand,
      part_type: part_type?.parttype,
      partname: part?.partname,
      partdescribe: part?.partdescribe,
      quantity: part?.partquantity,
      id: id,
      pb: pb,
      pt: pt,
      v_brand: vbrand,
      v_model: vmodel,
      part_model: part_model,
    })
  }

  public async update({ request, response }: HttpContextContract) {
    console.log(request.all())
    const part = await Part.findOrFail(request.all().id)
    part.partbrand_id = request.all().partbrand_id
    part.parttype_id = request.all().parttype_id
    part.partname = request.all().partname
    part.partdescribe = request.all().partdescribe

    await part.save()

    console.log(part.$isPersisted)

    response.redirect('/part_list')
  }

  public async delete({ params, response }: HttpContextContract) {
    console.log(params)
    const id = params.id
    const part = await Part.find(id)
    await part?.delete()

    response.redirect('/part_list')
  }
}
