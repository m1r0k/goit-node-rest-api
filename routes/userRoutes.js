import express from "express";
import UserController from "../controllers/userControllers.js";
import uploadMiddleware from "../middlewares/upload.js";
import authMiddleware from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.get("/avatar", UserController.getAvatar);
userRouter.patch(
  "/avatar",
  authMiddleware,
  uploadMiddleware.single("avatar"),
  UserController.uploadAvatar
);

export default userRouter;
