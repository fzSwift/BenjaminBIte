import { promises as fs } from "fs";
import path from "path";

type Metadata = {
  name: string;
  description: string;
  price: number;
  category: string;
  dietaryPreferences: string[];
};

const metadataByFile: Record<string, Metadata> = {
  "jollof.png": {
    name: "Jollof Rice and Chicken",
    description: "Smoky jollof rice with grilled chicken and fresh salad.",
    price: 12,
    category: "Lunch",
    dietaryPreferences: ["Halal"]
  },
  "veggie-wrap.png": {
    name: "Veggie Wrap",
    description: "Whole wheat wrap with hummus, lettuce, cucumber, and tomato.",
    price: 8,
    category: "Snacks",
    dietaryPreferences: ["Vegetarian"]
  },
  "fruit-smoothie.png": {
    name: "Fruit Smoothie",
    description: "Banana, mango, and strawberry smoothie.",
    price: 5,
    category: "Drinks",
    dietaryPreferences: ["Vegan"]
  },
  "pancake.png": {
    name: "Pancake Stack",
    description: "Fluffy pancakes topped with maple syrup and berries.",
    price: 7,
    category: "Breakfast",
    dietaryPreferences: ["Vegetarian"]
  },
  "waakye.png": {
    name: "Waakye with Fish",
    description: "Rice and beans served with fried fish, spaghetti, and gari.",
    price: 10,
    category: "Lunch",
    dietaryPreferences: []
  },
  "fried-rice.png": {
    name: "Fried Rice and Chicken",
    description: "Classic fried rice served with crispy chicken.",
    price: 11,
    category: "Lunch",
    dietaryPreferences: []
  },
  "banku.png": {
    name: "Banku and Tilapia",
    description: "Grilled tilapia served with banku and pepper sauce.",
    price: 13,
    category: "Lunch",
    dietaryPreferences: []
  },
  "indomie.png": {
    name: "Indomie Special",
    description: "Stir-fried noodles with egg, vegetables, and sausage.",
    price: 6,
    category: "Snacks",
    dietaryPreferences: []
  },
  "burger.png": {
    name: "Chicken Burger",
    description: "Juicy chicken burger with lettuce and cheese.",
    price: 9,
    category: "Fast Food",
    dietaryPreferences: []
  },
  "shawarma.png": {
    name: "Beef Shawarma",
    description: "Spicy beef shawarma wrapped with creamy sauce.",
    price: 7,
    category: "Snacks",
    dietaryPreferences: ["Halal"]
  },
  "pizza.png": {
    name: "Pepperoni Pizza Slice",
    description: "Cheesy pizza slice with pepperoni topping.",
    price: 6,
    category: "Fast Food",
    dietaryPreferences: []
  },
  "grilled-chicken-salad.png": {
    name: "Grilled Chicken Salad",
    description: "Healthy grilled chicken with fresh vegetables.",
    price: 9,
    category: "Healthy",
    dietaryPreferences: ["Low Carb"]
  },
  "egg.png": {
    name: "Egg Sandwich",
    description: "Simple egg sandwich with mayo and lettuce.",
    price: 4,
    category: "Breakfast",
    dietaryPreferences: ["Vegetarian"]
  },
  "french-fries.png": {
    name: "French Fries",
    description: "Crispy golden fries with ketchup.",
    price: 3,
    category: "Sides",
    dietaryPreferences: ["Vegan"]
  },
  "nuggets.png": {
    name: "Chicken Nuggets",
    description: "Crispy chicken nuggets served with dip.",
    price: 5,
    category: "Snacks",
    dietaryPreferences: []
  },
  "spaghetti.png": {
    name: "Spaghetti Bolognese",
    description: "Pasta with rich beef tomato sauce.",
    price: 8,
    category: "Lunch",
    dietaryPreferences: []
  },
  "ice-cream.png": {
    name: "Ice Cream Cup",
    description: "Vanilla ice cream with chocolate topping.",
    price: 3,
    category: "Dessert",
    dietaryPreferences: ["Vegetarian"]
  },
  "coffee.png": {
    name: "Iced Coffee",
    description: "Cold brewed coffee with milk and sugar.",
    price: 4,
    category: "Drinks",
    dietaryPreferences: []
  },
  "beans.png": {
    name: "Fried Plantain and Beans",
    description: "Sweet fried plantain served with beans stew.",
    price: 7,
    category: "Lunch",
    dietaryPreferences: ["Vegetarian"]
  },
  "spring-rolls.png": {
    name: "Spring Rolls",
    description: "Crispy vegetable spring rolls with sweet chili sauce.",
    price: 5,
    category: "Snacks",
    dietaryPreferences: ["Vegetarian"]
  }
};

const toTitleCaseFromFileName = (fileName: string): string => {
  const withoutExt = fileName.replace(/\.[^.]+$/, "");
  return withoutExt
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const run = async () => {
  const backendRoot = path.resolve(__dirname, "..", "..");
  const workspaceRoot = path.resolve(backendRoot, "..");
  const menuDir = path.resolve(workspaceRoot, "frontend", "public", "menu");
  const targetFile = path.resolve(backendRoot, "src", "data", "defaultMenuItems.ts");

  const files = (await fs.readdir(menuDir))
    .filter((file) => file.toLowerCase().endsWith(".png"))
    .sort((a, b) => a.localeCompare(b));

  if (files.length === 0) {
    throw new Error(`No PNG files found in ${menuDir}`);
  }

  const itemBlocks = files.map((fileName, index) => {
    const meta = metadataByFile[fileName];
    const fallbackName = toTitleCaseFromFileName(fileName);
    const data = meta || {
      name: fallbackName,
      description: `${fallbackName} prepared fresh for Benjamin Bite.`,
      price: 5,
      category: "Snacks",
      dietaryPreferences: []
    };

    return `  {
    _id: "offline-${index + 1}",
    name: "${data.name}",
    description: "${data.description}",
    price: ${data.price},
    category: "${data.category}",
    image: "/menu/${fileName}",
    dietaryPreferences: ${JSON.stringify(data.dietaryPreferences)},
    available: true
  }`;
  });

  const fileContents = `export interface DefaultMenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  dietaryPreferences: string[];
  available: boolean;
}

export const defaultMenuItems: DefaultMenuItem[] = [
${itemBlocks.join(",\n")}
];
`;

  await fs.writeFile(targetFile, fileContents, "utf-8");
  console.log(`Generated ${files.length} fallback menu items in ${targetFile}`);
};

run().catch((error) => {
  console.error("Failed to generate default menu items:", error);
  process.exit(1);
});
