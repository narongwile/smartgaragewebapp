import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PartConditions extends BaseSchema {
  protected tableName = 'part_conditions'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('part_id').unsigned().notNullable().references('parts.id').onDelete('CASCADE')
      table.string('condition', 100).notNullable()
      table.integer('partquantity').notNullable()
      table.integer('price').notNullable()

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
