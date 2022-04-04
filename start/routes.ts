/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/
// import Database from '@ioc:Adonis/Lucid/Database'
import Route from '@ioc:Adonis/Core/Route'
import Database from '@ioc:Adonis/Lucid/Database'
import Garage from 'App/Models/Garage'

// Route.get('/', async ({ view }) => {
//   return view.render('welcome')
// })

Route.get('/', async ({ view }) => {
  return view.render('welcome_page')
})

Route.get('/register', 'AuthController.showRegister')
Route.post('/register', 'AuthController.register')
Route.post('/logout', 'AuthController.logout')
Route.get('/login', 'AuthController.showLogin')
Route.post('/login', 'AuthController.login')

Route.get('/stock_part/:id', 'InventoriesController.showAddStock')
Route.get('/stock_part', 'InventoriesController.showAddStock')
Route.post('/stock_part', 'InventoriesController.addStock')

Route.get('/stock_list', 'InventoriesController.showStock')

Route.get('/stock_update/:id', 'InventoriesController.showUpdate').as('stocks.update')
Route.post('/stock_update/:id', 'InventoriesController.update')

Route.get('/stock_delete/:id', 'InventoriesController.delete').as('stocks.delete')



Route.post('/part_add', 'PartsController.addPart')
Route.get('/part_add', 'PartsController.showAddPart')

Route.get('/part_list', 'PartsController.showAutoParts')

Route.get('/part_update/:id', 'PartsController.showUpdate').as('parts.update')
Route.post('/part_update/:id', 'PartsController.update')

Route.get('/part_delete/:id', 'PartsController.delete').as('parts.delete')



Route.get('/part_brandtype', 'CategoriesController.showPartBrandType')


Route.post('/part_brand_add', 'CategoriesController.addPartBrand')
Route.get('/part_brand_add', 'CategoriesController.showAddPartBrand')

Route.get('/part_brand_update/:id', 'CategoriesController.showUpdatePartBrand').as('parts.update.brand')
Route.post('/part_brand_update/:id', 'CategoriesController.updatePartBrand')

Route.get('/part_brand_delete/:id', 'CategoriesController.deletePartBrand').as('parts.delete.brand')


Route.post('/part_type_add', 'CategoriesController.addPartType')
Route.get('/part_type_add', 'CategoriesController.showAddPartType')

Route.get('/part_type_update/:id', 'CategoriesController.showUpdatePartType').as('parts.update.type')
Route.post('/part_type_update/:id', 'CategoriesController.updatePartType')

Route.get('/part_type_delete/:id', 'CategoriesController.deletePartType').as('parts.delete.type')



Route.post('/vehicle_brand_add', 'CategoriesController.addVehicleBrand')
Route.get('/vehicle_brand_add', 'CategoriesController.showAddVehicleBrand')

Route.post('/vehicle_model_add', 'CategoriesController.addVehicleModel')
Route.get('/vehicle_model_add', 'CategoriesController.showAddVehicleModel')
Route.get('/vehicle_model_add/:id', 'CategoriesController.showAddVehicleModel').as('vehicles.add.model')

Route.get('/vehicle_model', 'CategoriesController.showVehicleModel')

Route.get('/vehicle_brand_update/:id', 'CategoriesController.showUpdateVehicleBrand').as('vehicles.update.brand')
Route.post('/vehicle_brand_update/:id', 'CategoriesController.updateVehicleBrand')

Route.get('/vehicle_model_update/:id', 'CategoriesController.showUpdateVehicleModel').as('vehicles.update.model')
Route.post('/vehicle_model_update/:id', 'CategoriesController.updateVehicleModel')

Route.get('/vehicle_brand_delete/:id', 'CategoriesController.deleteVehicleBrand').as('vehicles.delete.brand')

Route.get('/vehicle_model_delete/:id', 'CategoriesController.deleteVehicleModel').as('vehicles.delete.model')


Route.get('/customer_list', 'CustomersController.showCustomer')

Route.get('/customer_update/:id', 'CustomersController.showUpdate').as('customer.update')
Route.post('/customer_update/:id', 'CustomersController.update')

Route.get('/customer_delete/:id', 'CustomersController.delete').as('customer.delete')



Route.get('/staff_add', 'EmployeesController.showAddStaff')
Route.post('/staff_add', 'EmployeesController.addStaff')
Route.get('/staff', 'EmployeesController.showStaff')
Route.get('/staff_update/:id', 'EmployeesController.showUpdateStaff').as('staff.update')
Route.post('/staff_update/:id', 'EmployeesController.updateStaff')
Route.post('/staff_update_permission/:id', 'EmployeesController.updateStaffPermission')
Route.get('/staff_delete/:id', 'EmployeesController.deleteStaff').as('staff.delete')

//https://medium.com/@tanakorn0412/%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%97%E0%B8%B3-auto-deploy-%E0%B8%94%E0%B9%89%E0%B8%A7%E0%B8%A2-circle-ci-%E0%B8%AA%E0%B8%B3%E0%B8%AB%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B9%80%E0%B8%8B%E0%B8%B4%E0%B8%9F%E0%B9%80%E0%B8%A7%E0%B8%AD%E0%B8%A3%E0%B9%8C-linux-digital-ocean-droplet-db1425e6271c

Route.post('/garage_profile', 'GaragesController.update')
Route.get('/garage_profile', async ({ view }) => {
  const garage = await Garage.find(1)
  return view.render('garage_profile', {garage: garage, feature: 'Garage Profile'})
})


Route.get('/dashboard', async ({ view }) => {
  return view.render('dashboard', {feature: 'Dashboard'})
})

Route.get('/profile', 'EmployeesController.profile')
Route.post('/profile', 'EmployeesController.updateProfile')


Route.get('/tables', async ({ view }) => {
  return view.render('tables')
})

Route.get('/forms', async ({ view }) => {
  return view.render('forms')
})

Route.get('/t', async ({ view }) => {
  const part = await Database.from('parts').select('*').orderBy('id', 'asc')
  return view.render('t', {part: part})
})

