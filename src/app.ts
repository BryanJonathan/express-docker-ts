import express from "express";
import cors from "cors";

import publicRouter from "./routes/public";
import privateRouter from "./routes/private";

const app = express();
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());

app.use("/api", publicRouter);
app.use("/api", privateRouter);

export default app;
