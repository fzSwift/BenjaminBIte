import dotenv from "dotenv";
import { connectDB } from "../config/db";
import { MenuItem } from "../models/MenuItem";

dotenv.config();

const sampleMenuItems = [
  {
    name: "Jollof Rice and Chicken",
    description: "Smoky jollof rice served with grilled chicken and fresh salad.",
    price: 12,
    category: "Lunch",
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80",
    dietaryPreferences: ["Halal"],
    available: true
  },
  {
    name: "Veggie Wrap",
    description: "Whole wheat wrap with hummus, lettuce, cucumber, and tomato.",
    price: 8,
    category: "Snacks",
    image:
      "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=1200&q=80",
    dietaryPreferences: ["Vegetarian"],
    available: true
  },
  {
    name: "Spaghetti Bolognese",
    description: "Rich tomato and beef sauce tossed with spaghetti.",
    price: 11,
    category: "Lunch",
    image:
      "https://images.unsplash.com/photo-1622973536968-3ead9e780960?auto=format&fit=crop&w=1200&q=80",
    dietaryPreferences: [],
    available: true
  },
  {
    name: "Fruit Smoothie",
    description: "Refreshing banana, mango, and strawberry smoothie.",
    price: 5,
    category: "Drinks",
    image:
      "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=1200&q=80",
    dietaryPreferences: ["Vegan"],
    available: true
  },
  {
    name: "Pancake Stack",
    description: "Fluffy pancakes with maple syrup and berries.",
    price: 7,
    category: "Breakfast",
    image:
      "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=1200&q=80",
    dietaryPreferences: ["Vegetarian"],
    available: true
  }
];

const seedMenu = async () => {
  try {
    await connectDB();
    await MenuItem.deleteMany({});
    await MenuItem.insertMany(sampleMenuItems);
    console.log("Sample menu items inserted successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed menu items:", error);
    process.exit(1);
  }
};

seedMenu();
