import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';
import Customer from 'App/Models/Customer';
import Employee from 'App/Models/Employee';
import Maintenance from 'App/Models/Maintenance';
import ServiceMaintenance from 'App/Models/ServiceMaintenance';
import Vehicle from 'App/Models/Vehicle';
import VehicleBrand from 'App/Models/VehicleBrand';
import VehicleModel from 'App/Models/VehicleModel';
import { DateTime } from 'luxon';


export default class VehicleMaintenancesController {
    public async showVehicles({ view }: HttpContextContract) {
        const vehicle = await Database.from('vehicles').select('*')
        const vbrand = await Database.from('vehicle_brands').select('*')
        const vmodel = await Database.from('vehicle_models').select('*')
        const customer = await Database.from('customers').select('*')

        return view.render('vehicle', {
            feature: 'Vehicle List',
            vehicle: vehicle,
            vbrand: vbrand,
            vmodel: vmodel,
            customer: customer,
        })
        
    }

    public async showMaintenances({ view }: HttpContextContract) {
        const maintenance = await Database.from('maintenances').select('*').orderBy('start_date', 'desc');
        const vehicle = await Vehicle.all();
        const vbrand = await VehicleBrand.all();
        const vmodel = await VehicleModel.all();
        const employee = await Employee.all();
        return view.render('maintenance', {
            feature: 'Maintenance List',
            maintenance: maintenance,
            vehicle: vehicle,
            vbrand: vbrand,
            vmodel: vmodel,
            employee: employee,
        });
    }

    public async showCheckLicense({ view }: HttpContextContract) {

        return view.render('maintenance_check_vehicle', {
            feature: 'Vehicle Maintenance',
        });
    }

    public async checkLicense({ view, request, response }: HttpContextContract) {
        console.log(request.all());
        if (request.all().license_id == null || request.all().license_id == 'null')
            response.redirect('back');

        if ((await Vehicle.findBy('license_id', request.all().license_id)) == null) {
            const vmodel = await Database.from('vehicle_models')
                .select('*')
                .orderBy('vehicle_model', 'asc');
            const vbrand = await Database.from('vehicle_brands')
                .select('*')
                .orderBy('vehicle_brand', 'asc');
            const customer = await Database.from('customers').select('*').orderBy('fname', 'asc');
            const service = await Database.from('services').select('*').orderBy('service', 'asc');
            return view.render('vehicle_maintenance_add', {
                feature: 'Vehicle Maintenance',
                license_id: request.all().license_id,
                v_brand: vbrand,
                v_model: vmodel,
                customer: customer,
                service: service,
            });
        } else {
            const vehicle = await Vehicle.findBy('license_id', request.all().license_id);
            const vmodel = await VehicleModel.find(vehicle?.vehiclemodel_id);
            const vbrand = await VehicleBrand.find(vmodel?.vehiclebrand_id);
            const customer = await Customer.find(vehicle?.customer_id);
            const service = await Database.from('services').select('*').orderBy('service', 'asc');
            return view.render('vehicle_maintenance_add', {
                feature: 'Vehicle Maintenance',
                license_id: request.all().license_id,
                cname: customer?.fname + ' ' + customer?.lname,
                cid: customer?.id,
                vbrand: vbrand,
                vmodel: vmodel,
                vcolour: vehicle?.colour,
                service: service,
            });
        }
    }

    public async addMaintenanceFromVehicle({ params, view }: HttpContextContract) {
            const vehicle = await Vehicle.find(params.id);
            const vmodel = await VehicleModel.find(vehicle?.vehiclemodel_id);
            const vbrand = await VehicleBrand.find(vmodel?.vehiclebrand_id);
            const customer = await Customer.find(vehicle?.customer_id);
            const service = await Database.from('services').select('*').orderBy('service', 'asc');
            return view.render('vehicle_maintenance_add', {
                feature: 'Vehicle Maintenance',
                license_id: vehicle?.license_id,
                cname: customer?.fname + ' ' + customer?.lname,
                cid: customer?.id,
                vbrand: vbrand,
                vmodel: vmodel,
                vcolour: vehicle?.colour,
                service: service,
            });
    }

    public async addVehicleMaintenance({ request, response, auth }: HttpContextContract) {
        console.log(request.all());

        let vid;
        try {
            if (await Vehicle.findByOrFail('license_id', request.all().license_id)) {
                vid = (await Vehicle.findBy('license_id', request.all().license_id))?.id;
            }
        } catch {
            if (!request.all().customer_id) {
                const customer = new Customer();
                await customer
                    .fill({
                        fname: request.all().fname,
                        lname: request.all().lname,
                        tel: request.all().tel,
                        email: request.all().email,
                        company: request.all().company,
                        customer_tax_id: request.all().taxid,
                        address: request.all().address,
                        password: '1',
                    })
                    .save();
                console.log('customer: ' + customer.$isPersisted);

                const vehicle = new Vehicle();
                await vehicle
                    .fill({
                        customer_id: customer.id,
                        vehiclemodel_id: request.all().vehiclemodel_id,
                        license_id: request.all().license_id,
                        colour: request.all().colour,
                    })
                    .save();
                console.log('vehicle: ' + vehicle.$isPersisted);

                vid = vehicle.id;
            } else {
                const vehicle = new Vehicle();
                await vehicle
                    .fill({
                        customer_id: request.all().customer_id,
                        vehiclemodel_id: request.all().vehiclemodel_id,
                        license_id: request.all().license_id,
                        colour: request.all().colour,
                    })
                    .save();
                console.log('vehicle: ' + vehicle.$isPersisted);

                vid = vehicle.id;
            }
        }
        console.log(vid);
        const maintenance = new Maintenance();
        await maintenance
            .fill({
                vehicle_id: vid,
                garage_id: 1,
                employee_id: auth.user?.id,
                start_date: DateTime.now(),
                status: 'Waiting',
            })
            .save();
        console.log('maintenance: ' + maintenance.$isPersisted);

        if (request.all().services != null) {
            for (let i = 0; i < request.all().services.length; i++) {
                if (request.all().services.length == 1) {
                    const service_maintenance = new ServiceMaintenance();
                    await service_maintenance
                        .fill({
                            maintenance_id: maintenance.id,
                            service_id: request.all().services,
                        })
                        .save();
                    console.log('service_maintenance: ' + service_maintenance.$isPersisted);
                }

                if (request.all().services.length > 1) {
                    const service_maintenance = new ServiceMaintenance();
                    await service_maintenance
                        .fill({
                            maintenance_id: maintenance.id,
                            service_id: request.all().services[i],
                        })
                        .save();
                    console.log('service_maintenance: ' + service_maintenance.$isPersisted);
                }
            }
        }

        response.redirect('/maintenance');
    }

    public async showUpdateVehicle({ view, params }: HttpContextContract) {
        const vehicle = await Vehicle.find(params.id)
        const vmodel = await VehicleModel.find(vehicle?.vehiclemodel_id)
        const vbrand = await VehicleBrand.find(vmodel?.vehiclebrand_id)
        const vbs = await Database.from('vehicle_brands').select('*')
        const vms = await Database.from('vehicle_models').select('*')
        const customer = await Database.from('customers').select('*').orderBy('fname', 'asc')

        return view.render('vehicle_update', {
            feature: 'Update',
            vehicle: vehicle,
            customer: customer,
            vbrand: vbrand,
            vmodel: vmodel,
            vbs: vbs,
            vms: vms,
        })
    }

    public async updateVehicle({ request, response }: HttpContextContract) {
        console.log(request.all())
        let customer_id
        if(request.all().customer_id) {
            customer_id = request.all().customer_id
        }else {
                const customer = new Customer();
                await customer
                    .fill({
                        fname: request.all().fname,
                        lname: request.all().lname,
                        tel: request.all().tel,
                        email: request.all().email,
                        company: request.all().company,
                        customer_tax_id: request.all().taxid,
                        address: request.all().address,
                        password: '1',
                    })
                    .save();
                console.log('customer: ' + customer.$isPersisted);
                customer_id = customer.id
        }
        const vehicle = await Vehicle.findByOrFail('license_id', request.all().license_id)
        vehicle.customer_id = customer_id
        vehicle.vehiclemodel_id = request.all().vehiclemodel_id
        vehicle.colour = request.all().colour
        await vehicle.save()
        console.log('vehicle update: ' + vehicle.$isPersisted)
        response.redirect('/vehicle')
    }

    public async deleteVehicle({ params, response }: HttpContextContract) {
        const vehicle = await Vehicle.find(params.id)
        await vehicle?.delete()
        response.redirect('/vehicle')
    }

    public async deleteMaintenance({ params, response }: HttpContextContract) {
        const maintenance = await Maintenance.find(params.id)
        await maintenance?.delete()
        response.redirect('/maintenance')
    }
}
