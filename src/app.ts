import express from "express";
import publicRouter from "./routes/public";
import privateRouter from "./routes/private";

const app = express();

app.use(express.json());

app.use("/api", publicRouter);
app.use("/api", privateRouter);

export default app;
