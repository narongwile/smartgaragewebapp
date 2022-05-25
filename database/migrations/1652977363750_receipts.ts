import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Receipts extends BaseSchema {
  protected tableName = 'receipts'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.datetime('payment_date').notNullable()
      table.integer('cost').notNullable()

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
