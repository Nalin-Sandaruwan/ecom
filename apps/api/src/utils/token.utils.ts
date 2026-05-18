import jwt from "jsonwebtoken";
import { IUser } from "../models/User";

/**
 * Generate Access Token
 */
export const generateAccessToken = (user: IUser) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: (process.env.ACCESS_TOKEN_EXPIRES_IN as any) || "1h" }
  );
};

/**
 * Generate Refresh Token
 */
export const generateRefreshToken = (user: IUser) => {
  return jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: (process.env.REFRESH_TOKEN_EXPIRES_IN as any) || "7d" }
  );
};
