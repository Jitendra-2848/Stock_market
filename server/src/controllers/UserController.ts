import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/JwtValidation.js";
import type { UpdateProfileInput } from "../validators/Auth.Validate.js";

export const GetUserProfile = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({
                success: false,
                message: "Unauthorized access",
            });
            return;
        }

        res.status(200).json({
            success: true,
            user: {
                id: user.userId,
                email: user.email,
            },
        });
    } catch (error: unknown) {
        console.error("GetUserProfile error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve profile",
        });
    }
};

export const UpdateUserProfile = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({
                success: false,
                message: "Unauthorized access",
            });
            return;
        }

        const { name } = req.body as UpdateProfileInput;

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: user.userId,
                email: user.email,
                name,
            },
        });
    } catch (error: unknown) {
        console.error("UpdateUserProfile error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update profile",
        });
    }
};
