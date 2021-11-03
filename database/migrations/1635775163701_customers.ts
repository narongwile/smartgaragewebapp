import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Customers extends BaseSchema {
  protected tableName = 'customers'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('fname', 255).notNullable()
      table.string('lname', 255).notNullable()
      table.string('tel', 20).notNullable().unique()
      table.string('company', 255)
      table.string('address', 255)
      table.string('customer_tax_id', 30)
      table.string('email', 100).notNullable().unique()
      table.string('password', 180).notNullable()

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
