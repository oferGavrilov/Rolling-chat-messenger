import type { Request, Response, NextFunction } from 'express'

export function notFound(req: Request, res: Response, next: NextFunction) {
      const error = new Error(`Not Found - ${req.originalUrl}`)
      res.status(404)
      next(error)
}

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
      const statusCode = res.statusCode === 200 ? 500 : res.statusCode
      res.status(statusCode)

      if (err instanceof Error) {
            res.json({
                  message: err.message,
                  stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
            })
      } else {
            console.log('errorMiddleware', err)
      }

      next();
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
      } else if (statusCode === 404) {
            message = 'Not found'
      } else if (statusCode === 400) {
            message = 'Bad request'
      } else if (statusCode === 403) {
            message = 'Forbidden'
      } else if (statusCode === 409) {
            message = 'Conflict'
      } else if (statusCode === 422) {
            message = 'Unprocessable Entity'
      }

      const customError = new CustomError(error.message, message, statusCode)
      customError.statusCode = statusCode
      return customError
}

class CustomError extends Error {
      statusCode: number
      constructor(log: string, message: string, statusCode: number) {
            console.log('CustomError', statusCode)
            super(message);
            this.statusCode = statusCode;

      }
}

export default CustomError;
