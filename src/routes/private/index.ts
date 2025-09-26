import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware";
import userRouter from "./users";

const privateRouter = Router();
privateRouter.use(authMiddleware);

privateRouter.use(userRouter);

export default privateRouter;
