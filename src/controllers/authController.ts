import { Request, Response } from "express";
import { AuthService } from "../services/authService";
import { ApiResponse } from "../types/apiResponse.types";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      const response: ApiResponse = {
        success: false,
        message: "Email and password are required",
      };
      res.status(400).json(response);
    }

    const { user, token } = await this.authService.login(email, password);

    const response: ApiResponse = {
      success: true,
      message: "Login successful",
      data: { user, token },
    };

    res.status(200).json(response);
  };
}
