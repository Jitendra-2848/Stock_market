import express from "express";
import { GetUserProfile, UpdateUserProfile } from "../controllers/UserController.js";
import { authenticateToken } from "../middleware/JwtValidation.js";
import { validateBody } from "../middleware/Validation.middleware.js";
import { updateProfileSchema } from "../validators/Auth.Validate.js";

const UserRouter = express.Router();

UserRouter.get("/profile", authenticateToken, GetUserProfile);
UserRouter.put("/profile", authenticateToken, validateBody(updateProfileSchema), UpdateUserProfile);

export default UserRouter;