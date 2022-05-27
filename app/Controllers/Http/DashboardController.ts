import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Garage from 'App/Models/Garage'
import { FixedOffsetZone } from 'luxon'
import Maintenance from '../../Models/Maintenance'

export default class DashboardController {
  public async showDashboard({ view }: HttpContextContract) {
    const garage = await Garage.find(1)
    const maintenancesSuccessResult = await Maintenance.query()
      .from('maintenances')
      .select('*')
      .where('status', 'LIKE', 'Success')
      .preload('vehicles', (q) => {})
      .preload('service_maintenances', (q) => {
        q.preload('order_parts').preload('services')
      })

    const maintenancesNotSuccessResult = await Maintenance.query()
      .from('maintenances')
      .select('*')
      .where('status', 'NOT LIKE', 'Success')
      .preload('vehicles', (q) => {})

    const allMaintenancesResult = await Maintenance.query()
      .from('maintenances')
      .select('*')
      .preload('service_maintenances', (q) => {})

    const vehicleSuccess = maintenancesSuccessResult.map((m) => ({
      vehicle: m.vehicles,
    }))
    const countVehicleSuccess = [...new Set(vehicleSuccess.map((obj) => obj.vehicle.id))].length

    const vehicleNotSuccess = maintenancesNotSuccessResult.map((m) => ({
      vehicle: m.vehicles,
    }))
    const countVehicleNotSuccess = [...new Set(vehicleNotSuccess.map((obj) => obj.vehicle.id))]
      .length

    const serviceMaintenanceSuccess = maintenancesSuccessResult.map((m) => ({
      service: m.service_maintenances.map((sm) => sm.$attributes),
    }))
    var countServiceSuccess = 0
    serviceMaintenanceSuccess.forEach((service) => {
      countServiceSuccess += service.service.length
    })

    const partSuccess = maintenancesSuccessResult.map((m) => ({
      service: m.service_maintenances.map((sm) => ({
        part: sm.order_parts.map((part) => ({ part: part.quantity, price: part.sell_price })),
      })),
    }))
    var countAutoPartSuccess = 0
    partSuccess.forEach((service) => {
      service.service.forEach((order) => {
        order.part.forEach((part) => {
          countAutoPartSuccess += part.part
        })
      })
    })

    const allOrderPart = maintenancesSuccessResult.map((m) => ({
      service: m.service_maintenances.map((sm) => ({
        part: sm.order_parts.map((part) => ({ part: part.quantity, price: part.sell_price })),
      })),
    }))
    const allServiceSuccess = maintenancesSuccessResult.map((m) => ({
      service: m.service_maintenances.map((sm) => ({
        cost: sm.services.cost,
      })),
    }))

    var countIncomeOrderPart = 0
    var countIncomeService = 0
    allOrderPart.forEach((service) => {
      service.service.forEach((order) => {
        order.part.forEach((part) => {
          countIncomeOrderPart += part.price
        })
      })
    })
    allServiceSuccess.forEach((service) => {
      service.service.forEach((s) => {
        countIncomeService += s.cost
      })
    })
    var allIncome = countIncomeOrderPart + countIncomeService

    const maintenancesList = allMaintenancesResult.map((m) => ({
      month: m.createdAt.month,
      year: m.createdAt.year,
    }))
    var maintenancesGraph = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    maintenancesList.forEach((m) => {
      if ((m.year = 2022)) {
        switch (m.month) {
          case 1:
            maintenancesGraph[1]++
            break
          case 2:
            maintenancesGraph[2]++
            break
          case 3:
            maintenancesGraph[3]++
            break
          case 4:
            maintenancesGraph[4]++
            break
          case 5:
            maintenancesGraph[5]++
            break
          case 6:
            maintenancesGraph[6]++
            break
          case 7:
            maintenancesGraph[7]++
            break
          case 8:
            maintenancesGraph[8]++
            break
          case 9:
            maintenancesGraph[9]
            break
          case 10:
            maintenancesGraph[10]
            break
          case 11:
            maintenancesGraph[11]
            break
          case 12:
            maintenancesGraph[12]
            break
        }
      }
    })

    console.log(maintenancesSuccessResult)
    console.log('vehicle Success: ' + countVehicleNotSuccess)
    console.log('vehicle Not Success: ' + countVehicleSuccess)
    console.log('Service Success: ' + countServiceSuccess)
    console.log(serviceMaintenanceSuccess)

    partSuccess.forEach((p) => {
      p.service.forEach((e) => {
        e.part.forEach((element) => {
          console.log(element.part)
        })
      })
    })
    console.log('Part Success: ' + countAutoPartSuccess)
    console.log(allMaintenancesResult[0].createdAt.month)
    console.log(allMaintenancesResult[0].createdAt.year)

    console.log(maintenancesGraph)

    return view.render('dashboard', {
      feature: 'Garage: ' + garage?.company_en,
      inprogress: countVehicleNotSuccess,
      success: countVehicleSuccess,
      service: countServiceSuccess,
      autopart: countAutoPartSuccess,
      income: allIncome,
      graph: maintenancesGraph,
    })
  }
}
