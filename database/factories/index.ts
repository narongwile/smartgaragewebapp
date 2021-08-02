// import Factory from '@ioc:Adonis/Lucid/Factory'
import Database from '@ioc:Adonis/Lucid/Database'
import Route from '@ioc:Adonis/Core/Route'

Route.get('posts', async () => {
  return Database.from('posts').select('*')
})
