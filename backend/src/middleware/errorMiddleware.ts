import type { Request, Response } from 'express'
import { ForbiddenError, NotFoundError } from '../utils/errorHandler.js'

export function notFound(req: Request, res: Response) {
      const message = `Not Found - ${req.originalUrl}`;
      res.status(404).send(message);
}

export function errorHandler(req: Request, res: Response, err: unknown) {
      if (err instanceof NotFoundError || err instanceof ForbiddenError) {
            res.status(err.statusCode).json({ message: err.message })
      } else if (err instanceof Error) {
            const statusCode = res.statusCode === 200 ? 500 : res.statusCode
            res.status(statusCode).json({
                  message: err.message,
                  stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
            })
      } else {
            console.error('Non-Error object received in errorHandler:', err)
            res.status(500).json({
                  message: 'An unknown error occurred',
                  stack: process.env.NODE_ENV === 'production' ? '🥞' : ''
            })
      }
}

interface ErrorResponse {
      message: string
      statusCode: number
}

export function handleErrorService(error: Error, status?: number): ErrorResponse {
      const statusCode = status || 500
      let message = error.message || 'Something went wrong'

      if (statusCode === 500) {
            console.error(error)
      } else if (statusCode === 401) {
            message = 'Not authorized'
      } else if (statusCode === 400) {
            message = 'Bad request'
      } else if (statusCode === 403) {
            message = 'Forbidden'
      } else if (statusCode === 404) {
            message = 'Not found'
      } else if (statusCode === 409) {
            message = 'Conflict'
      } else if (statusCode === 422) {
            message = 'Unprocessable Entity'
      }

      return { message, statusCode }
}
