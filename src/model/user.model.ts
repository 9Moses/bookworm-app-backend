import mongoose, { Document, Types  } from "mongoose";
import bcrypt from "bcryptjs";


export interface UserDocument extends Document {
   _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  profileImage?: string;
  isModified(path: string): boolean;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<UserDocument>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  profileImage: { type: String, default: "" },
}, {
  timestamps: true
});

//hash password before saving user to db
userSchema.pre("save", async function () {
  const user = this as UserDocument;

  if (!user.isModified("password")) return; // stop here

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

//compare password
userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  const user = this as UserDocument;
  return bcrypt.compare(password, user.password);
};

export const User = mongoose.model<UserDocument>("User", userSchema);
