import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Parts extends BaseSchema {
  protected tableName = 'parts'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('partbrand_id').unsigned().notNullable().references('part_brands.id').onDelete('CASCADE')
      table.integer('parttype_id').unsigned().notNullable().references('part_types.id').onDelete('CASCADE')
      table.string('partname', 255).notNullable().unique()
      table.text('partdescribe')

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
