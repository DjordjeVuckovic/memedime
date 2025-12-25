import { Hono } from 'hono'
import { describeRoute, resolver } from 'hono-openapi'
import { getGlobalStats } from './handlers'
import { GlobalStatsRespSchema } from '@memedime/contracts'

const BASE_PATH = '/v1/stats'
const statsRouter = new Hono()

statsRouter.get(
  BASE_PATH,
  describeRoute({
    tags: ['Stats'],
    operationId: 'getGlobalStats',
    description: 'Get global platform statistics including total coins, daily activity, and unique wallets.',
    responses: {
      200: {
        description: 'Global statistics retrieved successfully',
        content: {
          'application/json': {
            schema: resolver(GlobalStatsRespSchema),
          },
        },
      },
    },
  }),
  async (c) => {
    const stats = await getGlobalStats()
    return c.json(stats, 200)
  },
)

export default statsRouter
