import dotenv from "dotenv";
import express, { type Request, type Response, type NextFunction } from "express";
import path from "node:path";
import cors from "cors";
import AuthRouter from "./routes/Auth.Route.js";
import UserRouter from "./routes/User.Route.js";

dotenv.config({ path: path.resolve(import.meta.dirname, "../.env") });

const server = express();

server.disable("x-powered-by");

const corsOptions: cors.CorsOptions = {
    origin:"*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

server.use(cors(corsOptions));
server.use(express.json({ limit: "10kb" }));
server.use(express.urlencoded({ extended: true, limit: "10kb" }));
server.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({
        status: "ok",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});
server.use("/api/auth", AuthRouter);
server.use("/api/users", UserRouter);


server.use((_req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: "Endpoint not found",
    });
});


server.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error("Unhandled Server Error:", err);
    res.status(500).json({
        success: false,
        message: "Internal server error",
        ...(process.env.NODE_ENV === "development" ? { error: err.message } : {}),
    });
});


const PORT = process.env.PORT ? Number(process.env.PORT) : 8000;


server.listen(PORT, () => {
    console.log(`Server is running securely on port: ${PORT}`);
});

export default server;