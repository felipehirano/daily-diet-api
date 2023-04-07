import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('meals', (table) => {
    table.dropColumn('date_meal')
    table.dropColumn('hour_meal')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('meals', (table) => {
    table.string('hour_meal')
    table.string('date_meal')
  })
}
