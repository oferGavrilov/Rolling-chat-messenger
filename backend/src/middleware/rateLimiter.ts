import { Request } from "express"
import { rateLimit } from "express-rate-limit"
import { logger } from "@/server"
import { env } from "@/utils/envConfig"

const rateLimiter = rateLimit({
    legacyHeaders: true,
    limit: env.COMMON_RATE_LIMIT_MAX_REQUESTS ?? 20,
    windowMs: 15 * 60 * (env.COMMON_RATE_LIMIT_WINDOW_MS ?? 1000),
    standardHeaders: true,
    message: 'Too many requests, please try again later.',
    keyGenerator,
})

function keyGenerator(request: Request): string {
    if (!request.ip) {
        logger.warn('Warning: Request.ip is missing!')
        return request.socket.remoteAddress as string
    }

    return request.ip.replace(/:\d+[^:]*$/, '')
}

export default rateLimiter
