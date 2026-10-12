import express from "express";
import { RegisterService, LoginService, GetMeService } from "../controllers/AuthController.js";
import { validateBody } from "../middleware/Validation.middleware.js";
import { registerSchema, loginSchema } from "../validators/Auth.Validate.js";
import { authenticateToken } from "../middleware/JwtValidation.js";

const AuthRouter = express.Router();

AuthRouter.post("/register", validateBody(registerSchema), RegisterService);
AuthRouter.post("/login", validateBody(loginSchema), LoginService);
AuthRouter.get("/me", authenticateToken, GetMeService);

export default AuthRouter;
