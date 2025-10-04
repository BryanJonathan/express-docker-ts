import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware";
import userRouter from "./users";
import adminRouter from "./admin";

const privateRouter = Router();
privateRouter.use(authMiddleware);

privateRouter.use("/user", userRouter);
privateRouter.use("/admin", adminRouter);

export default privateRouter;
