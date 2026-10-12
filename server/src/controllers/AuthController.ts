import type { Request, Response } from "express";
import jwt, { type SignOptions } from "jsonwebtoken";
import bcrypt from "bcrypt";
import type { AuthenticatedRequest } from "../middleware/JwtValidation.js";
import type { RegisterInput, LoginInput } from "../validators/Auth.Validate.js";

const BCRYPT_SALT_ROUNDS = 12;

export const generateToken = (userId: string, email: string): string => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is not configured in environment variables");
    }

    const expiresIn: NonNullable<SignOptions["expiresIn"]> =
        (process.env.JWT_EXPIRES_IN as NonNullable<SignOptions["expiresIn"]>) || "7d";

    const options: SignOptions = {
        expiresIn,
    };

    return jwt.sign({ userId, email }, secret, options);
};

export const RegisterService = async (
    req: Request<{}, {}, RegisterInput>,
    res: Response
): Promise<void> => {
    try {
        const { email, password, name } = req.body;

        const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

        const userId = "123";
        const token = generateToken(userId, email);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: {
                id: userId,
                email,
                ...(name ? { name } : {}),
            },
        });
    } catch (error: unknown) {
        console.error("RegisterService error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error during registration",
        });
    }
};

export const LoginService = async (
    req: Request<{}, {}, LoginInput>,
    res: Response
): Promise<void> => {
    try {
        const { email } = req.body;

        const userId = "123";
        const token = generateToken(userId, email);

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: userId,
                email,
            },
        });
    } catch (error: unknown) {
        console.error("LoginService error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error during login",
        });
    }
};

export const GetMeService = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        if (!req.user?.userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }

        res.status(200).json({
            success: true,
            user: {
                id: req.user.userId,
                email: req.user.email,
            },
        });
    } catch (error: unknown) {
        console.error("GetMeService error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve user profile",
        });
    }
};