import { Router } from "express";
import { UserController } from "../../controllers/userController";

const userRouter = Router();

const userController = new UserController();

userRouter.get("/users", userController.getAllUsers);
userRouter.get("/users/:id", userController.getUserById);
userRouter.put("/users/:id", userController.updateUser);
userRouter.delete("/users/:id", userController.deleteUser);

export default userRouter;
