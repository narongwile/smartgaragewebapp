import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Maintenances extends BaseSchema {
  protected tableName = 'maintenances'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('vehicle_id').unsigned().notNullable().references('vehicles.id').onDelete('CASCADE')
      table.integer('garage_id').unsigned().notNullable().references('garages.id').onDelete('CASCADE')
      table.integer('employee_id').unsigned().notNullable().references('employees.id').onDelete('CASCADE')
      table.integer('receipt_id').unsigned().references('receipts.id').onDelete('CASCADE')
      table.datetime('start_date').notNullable()
      table.datetime('end_date')
      table.string('status', 180).notNullable()
      table.text('comment')

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
