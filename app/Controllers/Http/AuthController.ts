import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import Employee from 'App/Models/Employee'

export default class AuthController {
    public showRegister({ view }: HttpContextContract) {
        return view.render('auth/register')

    }

    public async register({ request, auth, response }: HttpContextContract) {
        const validationSchema = schema.create({
            fname: schema.string({ trim: true }),
            lname: schema.string({ trim: true }),
            tel: schema.string({ trim: true }, [
                rules.maxLength(10),
            ]),
            email: schema.string({ trim: true }, [
                rules.email(),
                rules.maxLength(255),
                rules.unique({ table: 'Employee', column: 'email' }),
            ]),
            password: schema.string({ trim: true }, [
                rules.confirmed(),
            ]),
            dptid: schema.number(),
            empid: schema.number(),
        })

        const validatedData = await request.validate({
            schema: validationSchema,
        })

        const user = await Employee.create(validatedData)

        await auth.use('web').login(user)

        return response.redirect('/')
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
        
       // await auth.use('web').login(user)
        try {
            await auth.use('web').attempt(email, password)

            return response.redirect('/')
        } catch (error) {
            session.flash('notification', 'We couldn\'t verify your credentials.')

            return response.redirect('back')
        }

    }
}
