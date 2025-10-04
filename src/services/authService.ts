import { AuthRepository } from "../repositories/authRepository";
import { UserRepository } from "../repositories/userRepository";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { PublicUser, User } from "../types/user.types";
import { generateToken } from "../utils/generateToken";
import { saltRounds } from "../consts";

export class AuthService {
  private authRepository: AuthRepository;
  private userRepository: UserRepository;

  constructor() {
    this.authRepository = new AuthRepository();
    this.userRepository = new UserRepository();
  }

  async login(
    email: string,
    password: string
  ): Promise<{ user: PublicUser; token: string }> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      throw new Error("Invalid email or password");
    }

    const { passwordHash, ...userWithoutPasswordHash } = user;

    const token = this.createToken(user);

    return { user: userWithoutPasswordHash, token };
  }

  createToken(user: User) {
    if (!process.env.JWT_SECRET && !process.env.JWT_TIME_EXPIRES_IN) {
      throw new Error(
        "Missing JWT_SECRET or JWT_EXPIRES_IN in environment variables"
      );
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      } as SignOptions
    );

    return token;
  }

  async generateRecoverPasswordCode(
    email: string
  ): Promise<{ code: string; expiresAt: Date; existingCode: boolean }> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error("User not found");
    }

    const existingCode = await this.authRepository.getCurrentToken(user);

    if (existingCode) {
      return {
        code: existingCode.code,
        expiresAt: existingCode.expiresAt,
        existingCode: true,
      };
    }

    const code = generateToken(6);

    const expiresAt = await this.authRepository.createPasswordResetToken(
      code,
      user
    );
    return { code: code, expiresAt: expiresAt, existingCode: false };
  }

  async validateCodeAndResetPassword(
    code: string,
    email: string,
    password: string
  ) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error("User not found");
    }

    const existingCode = await this.authRepository.getCurrentToken(user);

    if (!existingCode) {
      throw new Error("Invalid code or expired");
    }

    if (existingCode.code !== code) {
      throw new Error("Invalid code");
    }

    const now = new Date();

    if (existingCode.expiresAt < now) {
      throw new Error("Expired code");
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userUpdated = await this.userRepository.updatePassword(
      user.id,
      hashedPassword
    );

    await this.authRepository.markTokenAsUsed(user.id, code);

    return userUpdated;
  }
}
