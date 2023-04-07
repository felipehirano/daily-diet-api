import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('meals', (table) => {
    table.dropColumn('date_time')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('meals', (table) => {
    table.string('date_time')
  })
}
