import { AuthRepository } from "../repositories/authRepository";
import { UserRepository } from "../repositories/userRepository";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { PublicUser } from "../types/user.types";

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

    if (!process.env.JWT_SECRET && !process.env.JWT_TIME_EXPIRES_IN) {
      throw new Error(
        "Missing JWT_SECRET or JWT_EXPIRES_IN in environment variables"
      );
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      } as SignOptions
    );

    return { user: userWithoutPasswordHash, token };
  }
}
