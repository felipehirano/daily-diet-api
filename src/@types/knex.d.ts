// eslint-disable-next-line no-unused-vars
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    meals: {
      id: string
      user_id: string
      name: string
      description: string
      is_diet: boolean
      created_at: string
      date_time: string
    }
  }
}
