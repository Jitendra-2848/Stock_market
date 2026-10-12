import type { Request, Response, NextFunction } from "express";
import { type ZodSchema, ZodError } from "zod";

export const validateBody = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            const parsed = schema.parse(req.body);
            req.body = parsed;
            next();
        } catch (error: unknown) {
            if (error instanceof ZodError) {
                res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: error.issues[0]?.message,
                });
                return;
            }

            res.status(400).json({
                success: false,
                message: "Invalid request payload",
            });
        }
    };
};
