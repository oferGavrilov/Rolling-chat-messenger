import { Request, Response, NextFunction } from "express"
import { ZodError, ZodSchema } from "zod"

export const validate = (schema: ZodSchema) =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse({
                params: req.params,
                query: req.query,
                body: req.body,
                file: req.file,
            })

            next()
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({
                    status: "error",
                    message: error.errors[0].message,
                })
            }

            next(error)
        }
    }
