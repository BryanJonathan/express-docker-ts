import { UserRepository } from "../repositories/userRepository";
import { User, CreateUserInput, UpdateUserInput } from "../types/user.types";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async createUser(userData: CreateUserInput): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error("Email already in use");
    }

    return await this.userRepository.create(userData);
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async updateUser(id: string, userData: UpdateUserInput): Promise<User> {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error("User not found");
    }

    if (userData.email && userData.email !== existingUser.email) {
      const emailExists = await this.userRepository.emailExists(
        userData.email,
        id
      );
      if (emailExists) {
        throw new Error("Email already in use");
      }
    }

    const updatedUser = await this.userRepository.update(id, userData);
    if (!updatedUser) {
      throw new Error("Error updating user");
    }

    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    const userExists = await this.userRepository.findById(id);
    if (!userExists) {
      throw new Error("User not found");
    }

    const deleted = await this.userRepository.delete(id);
    if (!deleted) {
      throw new Error("Error deleting user");
    }
  }

  async userExists(id: string): Promise<boolean> {
    const user = await this.userRepository.findById(id);
    return user !== null;
  }
}
