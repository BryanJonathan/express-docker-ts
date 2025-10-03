import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../config/database";
import { User } from "../types/user.types";
import { PasswordReset } from "../types/passwordReset.types";
import {
  PasswordResetTokenTable,
  PasswordResetTokenColumns,
} from "../types/dbTables/passwordResetTokens";

export class AuthRepository {
  async createPasswordResetToken(token: string, user: User) {
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); //15m

    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO ${PasswordResetTokenTable.TABLE_NAME} (${PasswordResetTokenColumns.USER_ID}, ${PasswordResetTokenColumns.TOKEN}, ${PasswordResetTokenColumns.EXPIRES_AT}) VALUES (?, ?, ?)`,
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
      `SELECT * FROM ${PasswordResetTokenTable.TABLE_NAME} WHERE ${PasswordResetTokenColumns.USER_ID} = ? AND ${PasswordResetTokenColumns.USED} = 0 AND ${PasswordResetTokenColumns.EXPIRES_AT} > NOW()`,
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
      `UPDATE ${PasswordResetTokenTable.TABLE_NAME} SET ${PasswordResetTokenColumns.USED} = 1 WHERE ${PasswordResetTokenColumns.USER_ID} = ? AND ${PasswordResetTokenColumns.TOKEN} = ?`,
      [userId, code]
    );

    if (result.affectedRows === 0) {
      throw new Error("Error updating reset token");
    }
  }
}
