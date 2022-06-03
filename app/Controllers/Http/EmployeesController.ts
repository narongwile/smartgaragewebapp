import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import Employee from 'App/Models/Employee'
import Permission from 'App/Models/Permission'

export default class EmployeesController {
  public async profile({ view }: HttpContextContract) {
    return view.render('profile', { feature: 'Profile' })
  }

  public async updateProfile({ request, response }: HttpContextContract) {
    console.log(request.all())
    const user = await Employee.findByOrFail('email', request.all().email)
    user.tel = request.all().tel

    await user.save()
    console.log(user.$isPersisted)

    response.redirect('/profile')
  }

  public async showAddStaff({ view }: HttpContextContract) {
    const fs = require('fs')
    const departments = JSON.parse(fs.readFileSync('public/departments.json'))
    return view.render('staff_add', {
      feature: 'Add',
      departments: departments,
    })
  }

  public async addStaff({ request, response }: HttpContextContract) {
    const validationSchema = schema.create({
      fname: schema.string({ trim: true }),
      lname: schema.string({ trim: true }),
      tel: schema.string({ trim: true }, [
        rules.maxLength(10),
        rules.unique({ table: 'employees', column: 'tel' }),
      ]),
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.maxLength(50),
        rules.unique({ table: 'employees', column: 'email' }),
      ]),
      department: schema.string({ trim: true }),
      password: schema.string({ trim: true }),
    })
    const validatedData = await request.validate({ schema: validationSchema })
    const emp = await Employee.create(validatedData)
    // await emp.fill({
    //     fname: request.all().fname,
    //     lname: request.all().lname,
    //     tel: request.all().tel,
    //     email: request.all().email,
    //     department: request.all().department,
    //     password: request.all().password,
    // }).save()
    console.log(emp.$isPersisted)

    response.redirect('/staff_update/' + emp.id)
  }

  public async showStaff({ view }: HttpContextContract) {
    const staff = await Database.from('employees').select('*').orderBy('id', 'asc')
    return view.render('staff_list', {
      feature: 'Staff List',
      staff: staff,
    })
  }

  public async showUpdateStaff({ view, params }: HttpContextContract) {
    const staff = await Employee.findOrFail(params.id)
    const fs = require('fs')
    const departments = JSON.parse(fs.readFileSync('public/departments.json'))
    const permissions = JSON.parse(fs.readFileSync('public/management.json'))

    const permission = await Database.from('permissions')
      .select('management')
      .where('employee_id', params.id)

    let npms_value = JSON.parse(fs.readFileSync('public/management.json'))
    const npms = new Array()

    for (let i = 0; i < permissions.length; i++) {
      console.log(permissions[i])
      for (let j = 0; j < permission.length; j++) {
        if (permission[j].management == permissions[i].management) {
          console.log(permissions[i].management == permission[j].management)
        }
        if (npms_value[i].management == permission[j].management) {
          delete npms_value[i].management
        }
      }
      console.log(npms_value)
      if (npms_value[i] != permissions[i].management && npms_value[i].management != null) {
        npms.push(npms_value[i].management)
      }
    }
    console.log(npms)
    console.log(permission)

    if (permission.length == 0) {
      console.log('Not permission')
    }
    return view.render('staff_update', {
      feature: 'Update',
      id: params.id,
      fname: staff.fname,
      lname: staff.lname,
      tel: staff.tel,
      email: staff.email,
      department: staff.department,
      departments: departments,
      permissions: permissions,
      permission: permission,
      npms: npms,
    })
  }

  public async updateStaff({ request, response, params }: HttpContextContract) {
    console.log(request.all())
    const staff = await Employee.findOrFail(params.id)
    staff.fname = request.all().fname
    staff.lname = request.all().lname
    staff.tel = request.all().tel
    staff.email = request.all().email
    staff.department = request.all().department
    await staff.save()

    console.log(staff.$isPersisted)
    response.redirect('/staff')
  }

  public async updateStaffPermission({ request, response, params, session }: HttpContextContract) {
    const permissResult = await Permission.query().where('employee_id', params.id)
    const permiss = permissResult.map((p) => p.management)
    permiss.forEach((p) => {
      session.forget(p)
    })
    try {
      // const permission = await Permission.query().where('employee_id', params.id)

      await Permission.query().where('employee_id', params.id).delete()
      if (request.all().management != null) {
        const isArray = Array.isArray(request.all().management)
        // console.log('isArray: ' + isArray)
        if (isArray) {
          for (var i in request.all().management) {
            const permission = new Permission()
            await permission
              .fill({
                employee_id: params.id,
                management: request.all().management[i],
              })
              .save()
            console.log('management' + request.all().management[i])
            session.put(request.all().management[i], request.all().management[i])

            //console.log('permission index ' + i + ': ' + permission.$isPersisted)
          }
        } else {
          const permission = new Permission()
          await permission
            .fill({
              employee_id: params.id,
              management: request.all().management,
            })
            .save()

          session.put(request.all().management, request.all().management)
        

          // console.log(permission.$isPersisted)
        }
      }
      //console.log(permission)
      response.redirect('/staff_update/' + params.id)
    } catch (error) {
      const isArray = Array.isArray(request.all().management)
      console.log('isArray: ' + isArray)
      if (isArray) {
        for (var i in request.all().management) {
          const permission = new Permission()
          await permission
            .fill({
              employee_id: params.id,
              management: request.all().management[i],
            })
            .save()

          session.put(request.all().management[i], request.all().management[i])

          console.log('permission index ' + i + ': ' + permission.$isPersisted)
        }
      } else {
        const permission = new Permission()
        await permission
          .fill({
            employee_id: params.id,
            management: request.all().management,
          })
          .save()

        session.put(request.all().management, request.all().management)

        console.log(permission.$isPersisted)
      }

      response.redirect('/staff_update/' + params.id)
    }
  }

  public async deleteStaff({ params, response }: HttpContextContract) {
    const staff = await Employee.find(params.id)
    await staff?.delete()

    response.redirect('/staff')
  }
}
