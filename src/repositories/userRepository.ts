import { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "../config/database";
import {
  User,
  CreateUserInput,
  UpdateUserInput,
  PublicUser,
} from "../types/user.types";
import { v4 as uuidv4 } from "uuid";

export class UserRepository {
  async create(userData: CreateUserInput): Promise<User> {
    const id = uuidv4();
    const { name, email, password } = userData;

    const [result] = await pool.execute<ResultSetHeader>(
      "INSERT INTO users (id, name, email, passwordHash) VALUES (?, ?, ?, ?)",
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
      "SELECT id, name, email, createdAt, updatedAt FROM users ORDER BY createdAt DESC"
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
      "SELECT id, name, email, passwordHash, createdAt, updatedAt FROM users WHERE id = ?",
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
      "SELECT id, name, email, passwordHash, createdAt, updatedAt FROM users WHERE email = ?",
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
      updates.push("name = ?");
      values.push(userData.name);
    }

    if (userData.email !== undefined) {
      updates.push("email = ?");
      values.push(userData.email);
    }

    if (updates.length === 0) {
      throw new Error("No field to update");
    }

    updates.push("updatedAt = CURRENT_TIMESTAMP");
    values.push(id);

    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE users SET ${updates.join(", ")} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      "DELETE FROM users WHERE id = ?",
      [id]
    );

    return result.affectedRows > 0;
  }

  async emailExists(email: string, excludeId?: string): Promise<boolean> {
    let query = "SELECT COUNT(*) as count FROM users WHERE email = ?";
    const params: any[] = [email];

    if (excludeId) {
      query += " AND id != ?";
      params.push(excludeId);
    }

    const [rows] = await pool.execute<RowDataPacket[]>(query, params);
    return rows[0]!.count > 0;
  }
}
