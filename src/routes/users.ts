import { Router } from "express";
import { UserController } from "../controllers/userController";

const router = Router();
const userController = new UserController();

router.post("/api/users", userController.createUser);
router.get("/api/users", userController.getAllUsers);
router.get("/api/users/:id", userController.getUserById);
router.put("/api/users/:id", userController.updateUser);
router.delete("/api/users/:id", userController.deleteUser);

export default router;
