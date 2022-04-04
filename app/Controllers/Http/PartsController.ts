import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Part from 'App/Models/Part'
import PartBrand from 'App/Models/PartBrand'
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

    const part_brand = await PartBrand.find(request.all().partbrand_id)
    
    console.log(part_brand)

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

    return view.render('part_add', {
      part_brand: part_brand,
      part_type: part_type,
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
