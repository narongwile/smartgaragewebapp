import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Stocks extends BaseSchema {
  protected tableName = 'stocks'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('part_id').unsigned().notNullable().references('parts.id').onDelete('CASCADE')
      table.datetime('instock_date').notNullable()
      table.datetime('warranty_date')
      table.integer('buy_price').notNullable()
      table.string('condition', 100).notNullable()
      table.string('product_year', 10)
      table.integer('qty_in_stock').notNullable()

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
