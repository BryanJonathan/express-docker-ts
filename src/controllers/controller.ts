import { Response } from "express";
import { ZodError } from "zod";
import { ApiResponse } from "../types/apiResponse.types";

export class Controller {
  public handleError(res: Response, error: unknown): void {
    console.error("Error on Controller:", error);

    if (error instanceof ZodError) {
      const response: ApiResponse = {
        success: false,
        message: "Invalid input data",
        error: error.issues
          .map((e) => `${e.path.join(".")}: ${e.message}`)
          .join(", "),
      };
      res.status(400).json(response);
      return;
    }

    if (error instanceof Error) {
      const statusCode = this.getStatusCodeFromError(error.message);

      const response: ApiResponse = {
        success: false,
        message: error.message,
      };

      res.status(statusCode).json(response);
      return;
    }

    const response: ApiResponse = {
      success: false,
      message: "Error on processing request",
    };

    res.status(500).json(response);
  }

  private getStatusCodeFromError(message: string): number {
    if (message.includes("not found")) return 404;
    if (message.includes("already exists") || message.includes("exists"))
      return 409;
    if (message.includes("required") || message.includes("invalid")) return 400;
    return 500;
  }
}
