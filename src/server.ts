import fastify from 'fastify'
import { userTransactionsRoutes } from './routes/users-transactions'
import cookie from '@fastify/cookie'
import { mealsTransactionsRoutes } from './routes/meals-transactions'

const app = fastify()

app.register(cookie)
app.register(userTransactionsRoutes, {
  prefix: 'users',
})
app.register(mealsTransactionsRoutes, {
  prefix: 'meals',
})
app.listen({ port: 3333 }).then(() => console.log('Server running'))
