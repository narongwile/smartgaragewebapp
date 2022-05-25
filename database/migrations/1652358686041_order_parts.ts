import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class OrderParts extends BaseSchema {
  protected tableName = 'order_parts'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('service_maintenance_id').unsigned().notNullable().references('service_maintenances.id').onDelete('CASCADE')
      table.integer('part_condition_id').unsigned().notNullable().references('part_conditions.id').onDelete('CASCADE')
      table.datetime('order_date').notNullable()
      table.integer('quantity').notNullable()
      table.integer('sell_price').notNullable()

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
