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
Route.get('/parts/stock', 'PartsController.stock')
Route.post('/parts/stock', 'PartsController.stock')
Route.get('/parts', 'PartsController.showAutoParts')

Route.get('/dashboard', async ({ view }) => {
  return view.render('dashboard')
})

Route.get('/profile', async ({ view }) => {
  return view.render('profile')
})

Route.get('/tables', async ({ view }) => {
  return view.render('tables')
})

Route.get('/forms', async ({ view }) => {
  return view.render('forms')
})