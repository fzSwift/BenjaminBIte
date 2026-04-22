import mongoose, { Document, Schema } from "mongoose";

export interface IMenuItem extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  dietaryPreferences: string[];
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const menuItemSchema = new Schema<IMenuItem>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    image: { type: String },
    dietaryPreferences: [{ type: String }],
    available: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const MenuItem = mongoose.model<IMenuItem>("MenuItem", menuItemSchema);
