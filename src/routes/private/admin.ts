import { Router } from "express";
import { authorizeMiddleware } from "../../middleware/authMiddleware";

const adminRouter = Router();
adminRouter.use(authorizeMiddleware(["admin"]));

export default adminRouter;
