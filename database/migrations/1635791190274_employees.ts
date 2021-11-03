import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Employees extends BaseSchema {
  protected tableName = 'employees'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('fname', 255).notNullable()
      table.string('lname', 255).notNullable()
      table.string('tel', 15).notNullable().unique()
      table.string('email', 180).notNullable().unique()
      table.string('password', 180).notNullable()
      table.string('department', 255).notNullable().unique()

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
