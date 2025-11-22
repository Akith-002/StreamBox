import prisma from "../config/database";
import { hashPassword, verifyPassword } from "../utils/passwordHash";
import { generateToken } from "../utils/jwt";
import { AppError } from "../middleware/errorHandler";
import { RegisterDto, LoginDto, AuthResponse } from "@streambox/shared";

export class AuthService {
  async register(data: RegisterDto): Promise<AuthResponse> {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError(400, "User with this email already exists");
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
      },
    });

    // Generate token
    const token = generateToken({ userId: user.id, email: user.email });

    return {
      user: {
        id: parseInt(user.id),
        username: user.email.split("@")[0],
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.avatarUrl || undefined,
      },
      token,
    };
  }

  async login(data: LoginDto): Promise<AuthResponse> {
    // Find user by username (email)
    const user = await prisma.user.findUnique({
      where: { email: data.username },
    });

    if (!user) {
      throw new AppError(401, "Invalid email or password");
    }

    // Verify password
    const isPasswordValid = await verifyPassword(user.password, data.password);

    if (!isPasswordValid) {
      throw new AppError(401, "Invalid email or password");
    }

    // Generate token
    const token = generateToken({ userId: user.id, email: user.email });

    return {
      user: {
        id: parseInt(user.id),
        username: user.email.split("@")[0],
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.avatarUrl || undefined,
      },
      token,
    };
  }
}
