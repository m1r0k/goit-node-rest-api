import express from "express";
import authMiddleware from "../middlewares/auth.js";
import AuthController from "../controllers/authControllers.js";
import { userSchema } from "../schemas/userSchemas.js";
import validateBody from "../helpers/validateBody.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(userSchema), AuthController.register);

authRouter.post("/login", validateBody(userSchema), AuthController.login);

authRouter.post("/logout", authMiddleware, AuthController.logout);

authRouter.get("/current", authMiddleware, AuthController.current);

export default authRouter;
