import { Request, Response } from "express";
import mongoose from "mongoose";
import { MenuItem } from "../models/MenuItem";
import { defaultMenuItems } from "../data/defaultMenuItems";

const isDatabaseConnected = (): boolean => mongoose.connection.readyState === 1;

export const getMenuItems = async (_req: Request, res: Response): Promise<void> => {
  if (!isDatabaseConnected()) {
    res.setHeader("X-App-Mode", "offline-demo");
    res.json(defaultMenuItems);
    return;
  }

  try {
    const items = await MenuItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    // Fallback for temporary DB issues so the menu still works for demos.
    res.setHeader("X-App-Mode", "offline-demo");
    res.json(defaultMenuItems);
  }
};

export const searchMenuItems = async (req: Request, res: Response): Promise<void> => {
  const { q, category } = req.query;

  if (!isDatabaseConnected()) {
    const qText = String(q || "").toLowerCase();
    const categoryText = String(category || "").toLowerCase();
    const filtered = defaultMenuItems.filter((item) => {
      const matchesQuery =
        !qText ||
        item.name.toLowerCase().includes(qText) ||
        item.description.toLowerCase().includes(qText);
      const matchesCategory = !categoryText || item.category.toLowerCase() === categoryText;
      return matchesQuery && matchesCategory;
    });
    res.setHeader("X-App-Mode", "offline-demo");
    res.json(filtered);
    return;
  }

  try {
    const filter: Record<string, unknown> = {};

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } }
      ];
    }

    if (category) filter.category = category;
    const items = await MenuItem.find(filter);
    res.json(items);
  } catch (error) {
    res.setHeader("X-App-Mode", "offline-demo");
    res.json(defaultMenuItems);
  }
};

export const createMenuItem = async (req: Request, res: Response): Promise<void> => {
  if (!isDatabaseConnected()) {
    res.status(503).json({ message: "Database unavailable. Cannot create menu item right now." });
    return;
  }

  try {
    const item = await MenuItem.create(req.body);
    res.status(201).json({ message: "Menu item created", item });
  } catch (error) {
    res.status(400).json({ message: "Failed to create menu item" });
  }
};

export const updateMenuItem = async (req: Request, res: Response): Promise<void> => {
  if (!isDatabaseConnected()) {
    res.status(503).json({ message: "Database unavailable. Cannot update menu item right now." });
    return;
  }

  try {
    const { id } = req.params;
    const item = await MenuItem.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!item) {
      res.status(404).json({ message: "Menu item not found" });
      return;
    }
    res.json({ message: "Menu item updated", item });
  } catch (error) {
    res.status(400).json({ message: "Failed to update menu item" });
  }
};
