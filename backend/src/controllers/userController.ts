import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { isPointsExpired } from "../services/loyaltyService";

const createToken = (id: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not configured");
  return jwt.sign({ id }, secret, { expiresIn: "7d" });
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, role, adminSecretKey, referredByCode } = req.body;
    if (!username || !email || !password) {
      res.status(400).json({ message: "username, email, and password are required" });
      return;
    }

    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400).json({ message: "User already exists with this email" });
      return;
    }

    let assignedRole: "user" | "admin" = "user";
    if (role === "admin") {
      if (adminSecretKey !== process.env.ADMIN_SECRET_KEY) {
        res.status(403).json({ message: "Invalid admin secret key" });
        return;
      }
      assignedRole = "admin";
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: assignedRole
    });

    // Optional referral reward: both users get bonus points.
    if (referredByCode) {
      const referrer = await User.findOne({ referralCode: referredByCode });
      if (referrer && referrer.id !== user.id) {
        referrer.pointsBalance += 50;
        referrer.bonusPoints += 50;
        referrer.pointsExpiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
        referrer.updateTier();
        await referrer.save();

        user.pointsBalance += 25;
        user.bonusPoints += 25;
        user.pointsExpiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
        user.updateTier();
        await user.save();
      }
    }

    res.status(201).json({
      message: "Registration successful",
      token: createToken(user.id),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        tier: user.tier
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to register user" });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    res.json({
      message: "Login successful",
      token: createToken(user.id),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        tier: user.tier
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to login" });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!req.user || (req.user.id !== id && req.user.role !== "admin")) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    const user = await User.findById(id).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { username, email } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { username, email },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({ message: "Profile updated", user: updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile" });
  }
};

export const getUserPoints = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    if (!req.user || (req.user.id !== userId && req.user.role !== "admin")) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    const user = await User.findById(userId).select("pointsBalance bonusPoints pointsExpiryDate tier");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (isPointsExpired(user)) {
      user.pointsBalance = 0;
      user.bonusPoints = 0;
      user.updateTier();
      await user.save();
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch loyalty points" });
  }
};
