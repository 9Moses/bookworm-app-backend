import jwt from "jsonwebtoken";
import config from "../config";

export const generateToken = (userId: string): string => {
  if (!config.JWT_SECRET ) {
    throw new Error("JWT_SECRET is missing in environment variables.");
  }

  return jwt.sign(
    { userId },
    config.JWT_SECRET as string,
    { expiresIn: "1d" }
  );
};
