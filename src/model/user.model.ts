import mongoose, { Document  } from "mongoose";
import bcrypt from "bcryptjs";


export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  profileImage?: string;
  isModified(path: string): boolean;
}

const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  profileImage: { type: String, default: "" },
});

//hash password before saving user to db
userSchema.pre("save", async function () {
  const user = this as IUser;

  if (!user.isModified("password")) return; // stop here

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

export const User = mongoose.model<IUser>("User", userSchema);
