import { Request, Response } from "express";
import { UserService } from "../services/userService";
import { createUserSchema, updateUserSchema } from "../types/user.types";
import { ApiResponse } from "../types/apiResponse.types";
import { Controller } from "./controller";

export class UserController extends Controller {
  private userService: UserService;

  constructor() {
    super();
    this.userService = new UserService();
  }

  createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const validatedData = createUserSchema.parse(req.body);

      const { user, token } = await this.userService.createUser(validatedData);

      const response: ApiResponse = {
        success: true,
        message: "User created successfully",
        data: { user, token },
      };

      res.status(201).json(response);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.userService.getAllUsers();

      const response: ApiResponse = {
        success: true,
        message: "Users retrieved successfully",
        data: users,
      };

      res.status(200).json(response);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        const response: ApiResponse = {
          success: false,
          message: "User ID is required",
        };
        res.status(400).json(response);
        return;
      }

      const user = await this.userService.getUserById(id);

      const response: ApiResponse = {
        success: true,
        message: "User found successfully",
        data: user,
      };

      res.status(200).json(response);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        const response: ApiResponse = {
          success: false,
          message: "User ID is required",
        };
        res.status(400).json(response);
        return;
      }

      const validatedData = updateUserSchema.parse(req.body);

      const user = await this.userService.updateUser(id, validatedData);

      const response: ApiResponse = {
        success: true,
        message: "User updated successfully",
        data: user,
      };

      res.status(200).json(response);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        const response: ApiResponse = {
          success: false,
          message: "User ID is required",
        };
        res.status(400).json(response);
        return;
      }

      await this.userService.deleteUser(id);

      const response: ApiResponse = {
        success: true,
        message: "User deleted successfully",
      };

      res.status(200).json(response);
    } catch (error) {
      this.handleError(res, error);
    }
  };
}
