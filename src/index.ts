import "dotenv/config";
import app from "./app";
import {
  testDatabaseConnection,
  closeDatabaseConnection,
} from "./config/database";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `🚀 Server listening on port ${PORT} (NODE_ENV=${process.env.NODE_ENV})`
  );

  testDatabaseConnection();
});

const gracefulShutdown = async (signal: string) => {
  console.log(`\n${signal} received. Closing server...`);

  server.close(async () => {
    console.log("🔒 HTTP server closed");

    try {
      await closeDatabaseConnection();
      process.exit(0);
    } catch (error) {
      console.error("Error during shutdown:", error);
      process.exit(1);
    }
  });

  setTimeout(() => {
    console.error("⚠️ Forcing shutdown after 10 seconds");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
