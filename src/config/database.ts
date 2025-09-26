import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.DB_HOST || "mysql_db",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root123",
  database: process.env.DB_NAME || "myapp_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
};

export const pool = mysql.createPool(dbConfig);

export async function testDatabaseConnection(): Promise<void> {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Connected successfully to MYSQL!");

    await connection.execute("SELECT 1");
    connection.release();
  } catch (error) {
    console.error("❌ Error connecting into MYSQL:", error);
    setTimeout(testDatabaseConnection, 5000);
  }
}

export async function closeDatabaseConnection(): Promise<void> {
  try {
    await pool.end();
    console.log("🔒 DB Connection closed");
  } catch (error) {
    console.error("Error closing DB:", error);
  }
}
