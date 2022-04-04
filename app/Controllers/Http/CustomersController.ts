import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Customer from 'App/Models/Customer'

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
}
