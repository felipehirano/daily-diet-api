import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { knex } from '../database'
import { calculateMetrics } from '../helpers/calculate-metrics'
import { checkSessionIdExists } from '../middlewares/check-session-id-exitsts'

export async function mealsTransactionsRoutes(app: FastifyInstance) {
  app.get(
    '/:userId',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const getTransactionParamsSchema = z.object({
        userId: z.string().uuid(),
      })

      const _listMeals = getTransactionParamsSchema.safeParse(request.params)

      if (_listMeals.success === false) {
        const errorMessage = `${_listMeals.error.errors[0].path} ${_listMeals.error.errors[0].message}}`
        throw new Error(errorMessage)
      }

      const meals = await knex('meals').select().where({
        user_id: _listMeals.data.userId,
      })

      return {
        meals,
      }
    },
  )

  app.post(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const dateTimeRegex = /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/

      const createTransactionBodySchema = z.object({
        userId: z.string().uuid(),
        name: z.string(),
        description: z.string(),
        isDiet: z.boolean(),
        dateTime: z.string().regex(dateTimeRegex),
      })

      const _newMeal = createTransactionBodySchema.safeParse(request.body)

      if (_newMeal.success === false) {
        const errorMessages = _newMeal.error.errors.map(
          (error: { path: any[]; message: any }) => {
            const path = error.path.join('.')
            return `${path} ${error.message}`
          },
        )
        const errorMessage = errorMessages.join(', ')
        throw new Error(errorMessage)
      }

      await knex('meals').insert({
        id: randomUUID(),
        user_id: _newMeal.data.userId,
        name: _newMeal.data.name,
        description: _newMeal.data.description,
        is_diet: _newMeal.data.isDiet,
        date_time: _newMeal.data.dateTime,
      })

      return reply.status(201).send()
    },
  )

  app.get(
    '/:userId/:mealId',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const getTransactionParamsSchema = z.object({
        userId: z.string().uuid(),
        mealId: z.string().uuid(),
      })

      const _getMeal = getTransactionParamsSchema.safeParse(request.params)

      if (_getMeal.success === false) {
        const errorMessage = `${_getMeal.error.errors[0].path} ${_getMeal.error.errors[0].message}}`
        throw new Error(errorMessage)
      }

      const meals = await knex('meals')
        .select()
        .where({
          user_id: _getMeal.data.userId,
          id: _getMeal.data.mealId,
        })
        .first()

      return {
        meals,
      }
    },
  )

  app.delete(
    '/:userId/:mealId',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const getTransactionParamsSchema = z.object({
        userId: z.string().uuid(),
        mealId: z.string().uuid(),
      })

      const _getMeal = getTransactionParamsSchema.safeParse(request.params)

      if (_getMeal.success === false) {
        const errorMessage = `${_getMeal.error.errors[0].path} ${_getMeal.error.errors[0].message}}`
        throw new Error(errorMessage)
      }

      const meal = await knex('meals').select().where({
        user_id: _getMeal.data.userId,
        id: _getMeal.data.mealId,
      })

      if (meal.length > 0) {
        await knex('meals')
          .select()
          .where({
            id: _getMeal.data.mealId,
            user_id: _getMeal.data.userId,
          })
          .del()

        return reply.status(200).send()
      }

      return reply
        .status(500)
        .send('No exist this meal to this user in database')
    },
  )

  app.put(
    '/:userId/:mealId',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const dateTimeRegex = /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/

      const getTransactionParamsSchema = z.object({
        userId: z.string().uuid(),
        mealId: z.string().uuid(),
      })

      const _getMeal = getTransactionParamsSchema.safeParse(request.params)

      if (_getMeal.success === false) {
        const errorMessage = `${_getMeal.error.errors[0].path} ${_getMeal.error.errors[0].message}}`
        throw new Error(errorMessage)
      }

      const createTransactionBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        isDiet: z.boolean(),
        dateTime: z.string().regex(dateTimeRegex),
      })

      const _updatedMeal = createTransactionBodySchema.safeParse(request.body)

      if (_updatedMeal.success === false) {
        const errorMessages = _updatedMeal.error.errors.map(
          (error: { path: any[]; message: any }) => {
            const path = error.path.join('.')
            return `${path} ${error.message}`
          },
        )
        const errorMessage = errorMessages.join(', ')
        throw new Error(errorMessage)
      }

      const meal = await knex('meals').select().where({
        user_id: _getMeal.data.userId,
        id: _getMeal.data.mealId,
      })

      if (meal.length > 0) {
        await knex('meals')
          .where({ id: _getMeal.data.mealId, user_id: _getMeal.data.userId })
          .update({
            name: _updatedMeal.data.name,
            description: _updatedMeal.data.description,
            is_diet: _updatedMeal.data.isDiet,
            date_time: _updatedMeal.data.dateTime,
          })

        return reply.status(201).send()
      }

      return reply
        .status(500)
        .send('No exist this meal to this user in database')
    },
  )

  app.get(
    '/metrics/:userId',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const getTransactionParamsSchema = z.object({
        userId: z.string().uuid(),
      })

      const _getMeal = getTransactionParamsSchema.safeParse(request.params)

      if (_getMeal.success === false) {
        const errorMessage = `${_getMeal.error.errors[0].path} ${_getMeal.error.errors[0].message}}`
        throw new Error(errorMessage)
      }

      const meals = await knex('meals').select().where({
        user_id: _getMeal.data.userId,
      })

      const metrics = calculateMetrics(meals)

      return metrics
    },
  )
}
