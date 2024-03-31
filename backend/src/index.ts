import { env } from '@/utils/envConfig'
import { server, logger } from '@/server'
import { disconnectDB } from './config/db'

server.listen(env.PORT, () => {
      const { NODE_ENV, HOST, PORT } = env
      logger.info(`Server running in ${NODE_ENV} mode on ${HOST}:${PORT}`)
})

const onCloseSignal = async () => {
      logger.info('Server shutting down')
      server.close(async () => {
            await disconnectDB()
            logger.info('Server closed')
            process.exit()
      })
      setTimeout(() => process.exit(1), 10000).unref() // Force close after 10s
}

process.on('SIGINT', onCloseSignal)
process.on('SIGTERM', onCloseSignal)

