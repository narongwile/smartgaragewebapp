import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ServiceMaintenances extends BaseSchema {
  protected tableName = 'service_maintenances'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('maintenance_id').unsigned().notNullable().references('maintenances.id').onDelete('CASCADE')
      table.integer('service_id').unsigned().notNullable().references('services.id').onDelete('CASCADE')

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
