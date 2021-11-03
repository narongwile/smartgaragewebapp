import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Garages extends BaseSchema {
  protected tableName = 'garages'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('company_th', 255).notNullable().unique()
      table.string('company_en', 255).notNullable().unique()
      table.string('email', 180).notNullable().unique()
      table.string('tel', 15).notNullable().unique()
      table.string('tax_id', 50).notNullable().unique()
      table.string('address', 255).notNullable().unique()

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
