import mongoose, { Document, Schema, Types } from "mongoose";

export type OrderStatus = "Pending" | "In Progress" | "Completed" | "Cancelled";

export interface IOrderItem {
  menuItemId: Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
}

export interface IStatusHistory {
  status: OrderStatus;
  updatedAt: Date;
  updatedBy: Types.ObjectId;
}

export interface IOrder extends Document {
  userId: Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  redeemedPoints: number;
  status: OrderStatus;
  orderDate: Date;
  statusHistory: IStatusHistory[];
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    menuItemId: { type: Schema.Types.ObjectId, ref: "MenuItem", required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const statusHistorySchema = new Schema<IStatusHistory>(
  {
    status: { type: String, enum: ["Pending", "In Progress", "Completed", "Cancelled"], required: true },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true }
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true, min: 0 },
    redeemedPoints: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ["Pending", "In Progress", "Completed", "Cancelled"], default: "Pending" },
    orderDate: { type: Date, default: Date.now },
    statusHistory: [statusHistorySchema]
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>("Order", orderSchema);
