import { Request, Response } from "express";
import { authService } from "./auth.service";

const register = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const result = await authService.registerFromDB(payload);
    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "User registered successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error registering user",
      error: error.message,
    });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const { accessToken, refreshToken } =
      await authService.loginFromDB(payload);
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "User logged in successfully",
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error logging in user",
      error: error.message,
    });
  }
};

const getCurrentUser = async (req: Request, res: Response) => {};

export const authController = {
  register,
  login,

  getCurrentUser,
};
