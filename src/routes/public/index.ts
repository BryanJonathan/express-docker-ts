import { Router } from "express";
import authRouter from "./auth";

const publicRouter = Router();

publicRouter.use(authRouter);

export default publicRouter;
