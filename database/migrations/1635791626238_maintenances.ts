import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Maintenances extends BaseSchema {
  protected tableName = 'maintenances'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('vehicle_id').unsigned().notNullable().references('vehicles.id').onDelete("CASCADE")
      table.integer('garage_id').unsigned().notNullable().references('garages.id').onDelete('CASCADE')
      table.integer('employee_id').unsigned().notNullable().references('employees.id').onDelete('CASCADE')
      table.datetime('start_date').notNullable()
      table.datetime('end_date')
      table.string('status', 180).notNullable()
      table.text('comment')
      table.integer('maintain_cost').notNullable()
      table.datetime('payment_date')
      table.integer('quotation_id')
      table.integer('invoice_id').notNullable()
      table.integer('receipt_id')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  
}
