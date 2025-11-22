import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { RegisterDto, LoginDto } from "@streambox/shared";

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
