import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import Employee from 'App/Models/Employee'

export default class AuthController {
  public showRegister({ view }: HttpContextContract) {
    const fs = require('fs')

    const rawdata = fs.readFileSync('resources/json/departments.json')
    const department = JSON.parse(rawdata)

    //console.log(student.find(item => item.brand == 'Honda'))

    return view.render('auth/register', {
      departments: department,
    })
  }

  public async register({ request, auth, response }: HttpContextContract) {
    const validationSchema = schema.create({
      fname: schema.string({ trim: true }),
      lname: schema.string({ trim: true }),
      tel: schema.string({ trim: true }, [
        rules.maxLength(15),
        rules.unique({ table: 'employees', column: 'tel' }),
      ]),
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.maxLength(180),
        rules.unique({ table: 'employees', column: 'email' }),
      ]),
      password: schema.string({ trim: true }, [rules.confirmed()]),
      department: schema.string({ trim: true }),
    })

    const validatedData = await request.validate({
      schema: validationSchema,
    })

    const user = await Employee.create(validatedData)

    await auth.use('web').login(user)

    return response.redirect('/dashboard')
  }

  public async logout({ auth, response }: HttpContextContract) {
    await auth.use('web').logout()

    return response.redirect('/')
  }

  public showLogin({ view }: HttpContextContract) {
    return view.render('auth/login')
  }

  public async login({ request, auth, response, session }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    //const user = await Employee.findByOrFail('email', email)
    //console.log('password: '+password)
    // await auth.use('web').login(user)
    try {
      await auth.use('web').attempt(email, password)

      return response.redirect('/dashboard')
    } catch (error) {
      session.flash('notification', "We couldn't verify your credentials.")
      console.log(error)

      return response.redirect('back')
    }
  }
}
