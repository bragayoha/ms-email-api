import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'games'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').unsigned().unique().notNullable()
      table.string('type', 50).unique().notNullable()
      table.string('description', 500).notNullable()
      table.integer('range').notNullable()
      table.decimal('price', 8, 2).defaultTo(0).unsigned().notNullable()
      table.integer('min_and_max_number').notNullable()
      table.string('color', 7).unique().notNullable()
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
