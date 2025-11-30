import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { RegisterDto, LoginDto, UpdateUserDto } from "@streambox/shared";
import { AuthRequest } from "../middleware/auth";
import { AppError } from "../middleware/errorHandler";

const authService = new AuthService();

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data: RegisterDto = req.body;
    const result = await authService.register(data);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data: LoginDto = req.body;
    const result = await authService.login(data);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;
    if (!userId) {
      throw new AppError(401, "User not authenticated");
    }
    const data: UpdateUserDto = req.body;
    const result = await authService.updateUser(userId, data);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
