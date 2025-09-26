import express from "express";
import userRouter from "./routes/private/users";

const app = express();

app.use(express.json());

app.use(userRouter);

export default app;
