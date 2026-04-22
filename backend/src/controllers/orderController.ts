import { Request, Response } from "express";
import { Order } from "../models/Order";
import { MenuItem } from "../models/MenuItem";
import { User } from "../models/User";
import { earnPoints, redeemPoints } from "../services/loyaltyService";

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { items } = req.body as { items: Array<{ menuItemId: string; quantity: number }> };
    if (!items || items.length === 0) {
      res.status(400).json({ message: "Order items are required" });
      return;
    }

    const prepared = await Promise.all(
      items.map(async (item) => {
        const menu = await MenuItem.findById(item.menuItemId);
        if (!menu) throw new Error("Invalid menu item");
        return { menuItemId: menu.id, name: menu.name, quantity: item.quantity, price: menu.price };
      })
    );

    const totalAmount = prepared.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order = await Order.create({
      userId: req.user.id,
      items: prepared,
      totalAmount,
      redeemedPoints: 0,
      status: "Pending",
      statusHistory: [{ status: "Pending", updatedAt: new Date(), updatedBy: req.user.id }]
    });

    const user = await User.findById(req.user.id);
    if (user) await earnPoints(user, totalAmount);

    res.status(201).json({ message: "Order placed", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to create order" });
  }
};

export const getUserOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    if (!req.user || (req.user.id !== userId && req.user.role !== "admin")) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user orders" });
  }
};

export const getAllOrders = async (_req: Request, res: Response): Promise<void> => {
  try {
    const orders = await Order.find().populate("userId", "username email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch all orders" });
  }
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    order.status = status;
    order.statusHistory.push({ status, updatedAt: new Date(), updatedBy: req.user.id } as never);
    await order.save();
    res.json({ message: "Order status updated", order });
  } catch (error) {
    res.status(400).json({ message: "Failed to update order status" });
  }
};

export const redeemOrderPoints = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { orderId } = req.params;
    const { pointsToRedeem } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    if (order.userId.toString() !== req.user.id) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }
    if (order.redeemedPoints > 0) {
      res.status(400).json({ message: "Points already redeemed for this order" });
      return;
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const result = await redeemPoints(user, pointsToRedeem, order.totalAmount);
    order.totalAmount = result.updatedTotal;
    order.redeemedPoints = result.redeemed;
    await order.save();

    res.json({
      message: "Points redeemed successfully",
      redeemedPoints: result.redeemed,
      updatedOrderTotal: order.totalAmount,
      updatedBalance: user.pointsBalance
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to redeem points";
    res.status(400).json({ message });
  }
};

export const searchOrdersAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId, username } = req.query as { orderId?: string; username?: string };
    const userFilter: Record<string, unknown> = {};
    if (username) userFilter.username = { $regex: username, $options: "i" };
    const users = username ? await User.find(userFilter).select("_id") : [];

    const filter: Record<string, unknown> = {};
    if (orderId) filter._id = orderId;
    if (username) filter.userId = { $in: users.map((u) => u._id) };

    const orders = await Order.find(filter).populate("userId", "username email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to search orders" });
  }
};

export const filterOrdersAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, startDate, endDate, minAmount, maxAmount, userId } = req.query;
    const filter: Record<string, unknown> = {};

    if (status) filter.status = status;
    if (userId) filter.userId = userId;

    if (startDate || endDate) {
      filter.orderDate = {};
      if (startDate) (filter.orderDate as Record<string, unknown>).$gte = new Date(startDate as string);
      if (endDate) (filter.orderDate as Record<string, unknown>).$lte = new Date(endDate as string);
    }

    if (minAmount || maxAmount) {
      filter.totalAmount = {};
      if (minAmount) (filter.totalAmount as Record<string, unknown>).$gte = Number(minAmount);
      if (maxAmount) (filter.totalAmount as Record<string, unknown>).$lte = Number(maxAmount);
    }

    const orders = await Order.find(filter).populate("userId", "username email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to filter orders" });
  }
};

export const getOrderHistoryAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate("statusHistory.updatedBy", "username email");
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    res.json(order.statusHistory);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order history" });
  }
};
