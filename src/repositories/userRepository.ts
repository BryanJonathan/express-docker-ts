import { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "../config/database";
import {
  User,
  CreateUserInput,
  UpdateUserInput,
  PublicUser,
} from "../types/user.types";
import { UserTable, UserTableColumns } from "../types/dbTables/users";
import { v4 as uuidv4 } from "uuid";

export class UserRepository {
  async create(userData: CreateUserInput): Promise<User> {
    const id = uuidv4();
    const { name, email, password } = userData;

    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO ${UserTable.TABLE_NAME} (${UserTableColumns.ID}, ${UserTableColumns.NAME}, ${UserTableColumns.EMAIL}, ${UserTableColumns.PASSWORD_HASH}) VALUES (?, ?, ?, ?)`,
      [id, name, email, password]
    );

    if (result.affectedRows === 0) {
      throw new Error("Error creating user");
    }

    const createdUser = await this.findById(id);
    if (!createdUser) {
      throw new Error("User created but didnt find it");
    }

    return createdUser;
  }

  async findAll(): Promise<PublicUser[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT ${UserTableColumns.ID}, ${UserTableColumns.NAME}, ${UserTableColumns.EMAIL}, ${UserTableColumns.CREATED_AT}, ${UserTableColumns.UPDATED_AT} FROM ${UserTable.TABLE_NAME} ORDER BY createdAt DESC`
    );

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    }));
  }

  async findById(id: string): Promise<User | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT ${UserTableColumns.ID}, ${UserTableColumns.NAME}, ${UserTableColumns.EMAIL}, ${UserTableColumns.PASSWORD_HASH}, ${UserTableColumns.CREATED_AT}, ${UserTableColumns.UPDATED_AT} FROM ${UserTable.TABLE_NAME} WHERE ${UserTableColumns.ID} = ?`,
      [id]
    );

    if (rows.length === 0) {
      return null;
    }

    const row = rows[0]!;
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      passwordHash: row.passwordHash,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT ${UserTableColumns.ID}, ${UserTableColumns.NAME}, ${UserTableColumns.EMAIL}, ${UserTableColumns.PASSWORD_HASH}, ${UserTableColumns.CREATED_AT}, ${UserTableColumns.UPDATED_AT} FROM ${UserTable.TABLE_NAME} WHERE ${UserTableColumns.EMAIL} = ?`,
      [email]
    );

    if (rows.length === 0) {
      return null;
    }

    const row = rows[0]!;
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      passwordHash: row.passwordHash,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    };
  }

  async update(
    id: string,
    userData: UpdateUserInput
  ): Promise<PublicUser | null> {
    const updates: string[] = [];
    const values: any[] = [];

    if (userData.name !== undefined) {
      updates.push(`${UserTableColumns.NAME} = ?`);
      values.push(userData.name);
    }

    if (userData.email !== undefined) {
      updates.push(`${UserTableColumns.EMAIL} = ?`);
      values.push(userData.email);
    }

    if (updates.length === 0) {
      throw new Error(`No field to update`);
    }

    updates.push(`${UserTableColumns.UPDATED_AT} = CURRENT_TIMESTAMP`);
    values.push(id);

    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE ${UserTable.TABLE_NAME} SET ${updates.join(", ")} WHERE ${
        UserTableColumns.ID
      } = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return await this.findById(id);
  }

  async updatePassword(userId: string, hashedPassword: string) {
    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE ${UserTable.TABLE_NAME} SET ${UserTableColumns.PASSWORD_HASH} = ? WHERE ${UserTableColumns.ID} = ?`,
      [hashedPassword, userId]
    );

    if (result.affectedRows === 0) {
      throw new Error("Error updating password");
    }

    return result.affectedRows === 1;
  }

  async delete(id: string): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      `DELETE FROM ${UserTable.TABLE_NAME} WHERE ${UserTableColumns.ID} = ?`,
      [id]
    );

    return result.affectedRows > 0;
  }

  async emailExists(email: string, excludeId?: string): Promise<boolean> {
    let query = `SELECT COUNT(*) as count FROM ${UserTable.TABLE_NAME} WHERE ${UserTableColumns.EMAIL} = ?`;
    const params: any[] = [email];

    if (excludeId) {
      query += ` AND ${UserTableColumns.ID} != ?`;
      params.push(excludeId);
    }

    const [rows] = await pool.execute<RowDataPacket[]>(query, params);
    return rows[0]!.count > 0;
  }
}
