import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthUserPayload {
    userId: string;
    email: string;
}

export interface AuthenticatedRequest extends Request {
    user?: AuthUserPayload;
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthUserPayload;
        }
    }
}

export const authenticateToken = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({
            success: false,
            message: "Access denied. No authorization header provided.",
        });
        return;
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
        res.status(401).json({
            success: false,
            message: "Invalid token format. Expected: 'Bearer <token>'",
        });
        return;
    }

    const token = parts[1];
    if (!token) {
        res.status(401).json({
            success: false,
            message: "Access token is missing",
        });
        return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error("JWT_SECRET is not configured in environment variables");
        res.status(500).json({
            success: false,
            message: "Authentication service misconfigured",
        });
        return;
    }

    try {
        const decoded = jwt.verify(token, secret) as AuthUserPayload;
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
        };
        next();
    } catch (error: unknown) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({
                success: false,
                message: "Authentication token has expired. Please log in again.",
            });
            return;
        }

        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({
                success: false,
                message: "Invalid authentication token.",
            });
            return;
        }

        res.status(401).json({
            success: false,
            message: "Authentication failed.",
        });
    }
};
