import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class VehicleBrands extends BaseSchema {
  protected tableName = 'vehicle_brands'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('vehicle_brand', 180).notNullable().unique()

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
