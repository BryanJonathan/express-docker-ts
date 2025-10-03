import { Request, Response } from "express";
import { AuthService } from "../services/authService";
import { ApiResponse } from "../types/apiResponse.types";
import { Controller } from "./controller";
import { sendMail } from "../libs/mailer";
import {
  recoverPasswordSchema,
  resetPasswordSchema,
} from "../types/passwordReset.types";

export class AuthController extends Controller {
  private authService: AuthService;

  constructor() {
    super();
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

    try {
      const { user, token } = await this.authService.login(email, password);

      const response: ApiResponse = {
        success: true,
        message: "Login successful",
        data: { user, token },
      };

      res.status(200).json(response);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  generateRecoverPasswordCode = async (req: Request, res: Response) => {
    try {
      const validateData = recoverPasswordSchema.parse(req.body);

      const { email } = validateData;

      const recoverData = await this.authService.generateRecoverPasswordCode(
        email
      );

      const emailMessage = `Your code is ${recoverData.code} and expires at ${recoverData.expiresAt}`;

      sendMail(email, emailMessage);

      return res.status(200).json({
        success: true,
        message: "If the email exists, you will receive a recovery code.",
      });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  resetPassword = async (req: Request, res: Response) => {
    try {
      const validadeData = resetPasswordSchema.parse(req.body);

      const { code, email, password } = validadeData;

      const validateAndUpdate =
        await this.authService.validateCodeAndResetPassword(
          code,
          email,
          password
        );

      if (validateAndUpdate) {
        return res.status(200).json({
          success: true,
          message: "Password update successfully",
        });
      }
    } catch (error) {
      this.handleError(res, error);
    }
  };
}
