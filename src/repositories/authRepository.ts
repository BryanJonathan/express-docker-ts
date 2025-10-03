import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../config/database";
import { User } from "../types/user.types";
import { PasswordReset } from "../types/passwordReset.types";

export class AuthRepository {
  async createPasswordResetToken(token: string, user: User) {
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); //15m

    const [result] = await pool.execute<ResultSetHeader>(
      "INSERT INTO password_reset_tokens (userId, token, expiresAt) VALUES (?, ?, ?)",
      [user.id, token, expiresAt]
    );

    if (result.affectedRows === 0) {
      throw new Error("Error creating code");
    }

    return expiresAt;
  }

  async getCurrentToken(
    user: User
  ): Promise<{ code: string; expiresAt: Date } | false> {
    const [existing] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM password_reset_tokens WHERE userId = ? AND used = 0 AND expiresAt > NOW()",
      [user.id]
    );

    if (existing.length > 0) {
      const data = existing[0] as PasswordReset;
      return { code: data.token, expiresAt: data.expiresAt };
    }

    return false;
  }

  async markTokenAsUsed(userId: string, code: string) {
    const [result] = await pool.execute<ResultSetHeader>(
      "UPDATE password_reset_tokens SET used = 1 WHERE userId = ? AND token = ?",
      [userId, code]
    );

    if (result.affectedRows === 0) {
      throw new Error("Error updating reset token");
    }
  }
}
