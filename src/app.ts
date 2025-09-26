import express from "express";
import healthRouter from "./routes/health";
import userRouter from "./routes/users";

const app = express();

app.use(express.json());

app.use(healthRouter);
app.use(userRouter);

export default app;
