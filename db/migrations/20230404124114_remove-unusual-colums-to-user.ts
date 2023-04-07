import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('total_meals')
    table.dropColumn('total_meals_in_diet')
    table.dropColumn('days_in_diet')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.integer('total_meals').notNullable()
    table.integer('total_meals_in_diet').notNullable()
    table.integer('days_in_diet').notNullable()
  })
}
