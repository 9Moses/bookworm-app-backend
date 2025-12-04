import { Request, Response } from "express";
import { User } from "../model/user.model";
import { generateToken } from "../utils/generateToken";

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    if (typeof password !== "string" || password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long.",
      });
    }

    if (!/[A-Z]/.test(password) || !/\d/.test(password)) {
      return res.status(400).json({
        message:
          "Password must contain at least one number and one uppercase letter.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Invalid credentials. Try again" });
    }

    //generate token
    const token = generateToken(user._id.toString());

    res.status(200).json({
      payload: {
        token,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          profileImage: user.profileImage,
        },
      },
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (typeof username !== "string" || username.length < 3) {
      return res.status(400).json({
        message: "Username must be a valid string of at least 3 characters.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    if (typeof password !== "string" || password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long.",
      });
    }

    if (!/[A-Z]/.test(password) || !/\d/.test(password)) {
      return res.status(400).json({
        message:
          "Password must contain at least one number and one uppercase letter.",
      });
    }

    //check if user already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    //get random avatar
    const profileImage = `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`;

    const user = new User({
      username,
      email,
      password,
      profileImage,
    });

    await user.save();

    const token = generateToken(user._id.toString());
    return res.status(201).json({
      payload: {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
        token,
      },
    });
  } catch (error: any) {
    console.log("Errorin registering user", error);
    return res.status(500).json({ message: error.message });
  }
};
