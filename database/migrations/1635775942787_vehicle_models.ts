import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class VehicleModels extends BaseSchema {
  protected tableName = 'vehicle_models'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('vehiclebrand_id').unsigned().notNullable().references('vehicle_brands.id').onDelete('CASCADE')
      table.string('vehicle_model', 180).notNullable().unique()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
