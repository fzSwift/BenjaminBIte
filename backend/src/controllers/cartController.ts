import { Request, Response } from "express";
import { Cart } from "../models/Cart";
import { MenuItem } from "../models/MenuItem";
import { Order } from "../models/Order";
import { earnPoints } from "../services/loyaltyService";
import { User } from "../models/User";

const ensureCart = async (userId: string) => {
  let cart = await Cart.findOne({ userId });
  if (!cart) cart = await Cart.create({ userId, items: [] });
  return cart;
};

export const addToCart = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { menuItemId, quantity } = req.body;
    const item = await MenuItem.findById(menuItemId);
    if (!item || !item.available) {
      res.status(404).json({ message: "Menu item not available" });
      return;
    }

    const cart = await ensureCart(req.user.id);
    const existing = cart.items.find((i) => i.menuItemId.toString() === menuItemId);
    if (existing) {
      existing.quantity += quantity ?? 1;
    } else {
      cart.items.push({ menuItemId, quantity: quantity ?? 1 });
    }

    await cart.save();
    res.status(201).json({ message: "Item added to cart", cart });
  } catch (error) {
    res.status(500).json({ message: "Failed to add item to cart" });
  }
};

export const getCart = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const cart = await ensureCart(req.user.id);
    await cart.populate("items.menuItemId");

    const items = cart.items
      .map((item) => {
        const menuItem = item.menuItemId as unknown as {
          _id: string;
          name: string;
          price: number;
          image?: string;
          available: boolean;
        };
        if (!menuItem?._id) return null;
        return {
          menuItemId: menuItem._id,
          name: menuItem.name,
          price: menuItem.price,
          image: menuItem.image,
          available: menuItem.available,
          quantity: item.quantity,
          lineTotal: menuItem.price * item.quantity
        };
      })
      .filter(Boolean);

    const totalAmount = items.reduce((sum, item) => sum + (item?.lineTotal || 0), 0);
    res.json({ userId: cart.userId, items, totalAmount });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};

export const updateCartItemQuantity = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { menuItemId } = req.params;
    const { quantity } = req.body;
    const cart = await ensureCart(req.user.id);
    const item = cart.items.find((i) => i.menuItemId.toString() === menuItemId);
    if (!item) {
      res.status(404).json({ message: "Item not found in cart" });
      return;
    }

    item.quantity = quantity;
    await cart.save();
    res.json({ message: "Cart updated", cart });
  } catch (error) {
    res.status(500).json({ message: "Failed to update cart item" });
  }
};

export const removeCartItem = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { menuItemId } = req.params;
    const cart = await ensureCart(req.user.id);
    cart.items = cart.items.filter((i) => i.menuItemId.toString() !== menuItemId);
    await cart.save();
    res.json({ message: "Item removed from cart", cart });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove item" });
  }
};

export const checkoutCart = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const cart = await ensureCart(req.user.id);
    if (cart.items.length === 0) {
      res.status(400).json({ message: "Cart is empty" });
      return;
    }

    const preparedItems = await Promise.all(
      cart.items.map(async (cartItem) => {
        const menuItem = await MenuItem.findById(cartItem.menuItemId);
        if (!menuItem) throw new Error("Menu item not found");
        return {
          menuItemId: menuItem.id,
          name: menuItem.name,
          quantity: cartItem.quantity,
          price: menuItem.price
        };
      })
    );

    const totalAmount = preparedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order = await Order.create({
      userId: req.user.id,
      items: preparedItems,
      totalAmount,
      redeemedPoints: 0,
      status: "Pending",
      statusHistory: [{ status: "Pending", updatedBy: req.user.id, updatedAt: new Date() }]
    });

    const user = await User.findById(req.user.id);
    if (user) {
      await earnPoints(user, totalAmount);
    }

    cart.items = [];
    await cart.save();
    res.status(201).json({ message: "Checkout successful", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to checkout cart" });
  }
};
