import mongoose, { Document, Model, Schema } from "mongoose";

export type UserRole = "user" | "admin";
export type UserTier = "Silver" | "Gold" | "Platinum";

export interface IUser {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  referralCode: string;
  pointsBalance: number;
  bonusPoints: number;
  pointsExpiryDate?: Date;
  tier: UserTier;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {
  updateTier(): void;
}

interface IUserModel extends Model<IUserDocument> {
  generateReferralCode(username: string): string;
}

const userSchema = new Schema<IUserDocument, IUserModel>(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    referralCode: { type: String, unique: true },
    pointsBalance: { type: Number, default: 0 },
    bonusPoints: { type: Number, default: 0 },
    pointsExpiryDate: { type: Date },
    tier: { type: String, enum: ["Silver", "Gold", "Platinum"], default: "Silver" }
  },
  { timestamps: true }
);

userSchema.statics.generateReferralCode = (username: string): string => {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${username.substring(0, 3).toUpperCase()}${random}`;
};

userSchema.methods.updateTier = function updateTier(this: IUserDocument): void {
  if (this.pointsBalance >= 1000) {
    this.tier = "Platinum";
  } else if (this.pointsBalance >= 500) {
    this.tier = "Gold";
  } else {
    this.tier = "Silver";
  }
};

userSchema.pre("validate", function preValidate(next) {
  if (!this.referralCode) {
    this.referralCode = User.generateReferralCode(this.username);
  }
  next();
});

export const User = mongoose.model<IUserDocument, IUserModel>("User", userSchema);
