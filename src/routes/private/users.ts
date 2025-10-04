import { Router } from "express";
import { UserController } from "../../controllers/userController";
import { authorizeMiddleware } from "../../middleware/authMiddleware";

const userRouter = Router();
userRouter.use(authorizeMiddleware(["user"]));

const userController = new UserController();

userRouter.get("/", userController.getAllUsers);
userRouter.get("/:id", userController.getUserById);
userRouter.put("/:id", userController.updateUser);
userRouter.delete("/:id", userController.deleteUser);

export default userRouter;
