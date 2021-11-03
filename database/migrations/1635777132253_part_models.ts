import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PartModels extends BaseSchema {
  protected tableName = 'part_models'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('vehiclemodel_id').unsigned().notNullable().references('vehicle_models.id').onDelete('CASCADE')
      table.integer('part_id').unsigned().notNullable().references('parts.id').onDelete('CASCADE')

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
