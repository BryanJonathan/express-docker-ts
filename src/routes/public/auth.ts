import { Router } from "express";
import { UserController } from "../../controllers/userController";
import { AuthController } from "../../controllers/authController";

const authRouter = Router();
const userController = new UserController();
const authController = new AuthController();

authRouter.post("/register", userController.createUser);
authRouter.post("/login", authController.login);
authRouter.post(
  "/recover-password",
  authController.generateRecoverPasswordCode
);
authRouter.post("/reset-password", authController.resetPassword);

export default authRouter;
