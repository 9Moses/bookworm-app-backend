import jwt from "jsonwebtoken";
import config from "../config";
import { User } from "../model/user.model";
import { NextFunction, Request, Response } from "express";

export const protectedRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //get token

    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "No authentication token, access denied" });
    }
    const token = authHeader.replace("Bearer ", "");

    //verify token
    const decoded = jwt.verify(
      token,
      config.JWT_SECRET as string
    ) as jwt.JwtPayload;

    if (!decoded?.userId) {
      return res.status(401).json({ message: "Invalid token, access denied" });
    }

    const user = await User.findById(decoded?.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized User " });
    }

     req.user = user;

    next();
  } catch (error: any) {
    console.log("Error authenticating user:", error);
    return res.status(500).json({ message: error.message });
  }
};
