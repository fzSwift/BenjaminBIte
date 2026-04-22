export interface DefaultMenuItem {
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
  {
    _id: "offline-1",
    name: "Banku and Tilapia",
    description: "Grilled tilapia served with banku and pepper sauce.",
    price: 13,
    category: "Lunch",
    image: "/menu/banku.png",
    dietaryPreferences: [],
    available: true
  },
  {
    _id: "offline-2",
    name: "Fried Plantain and Beans",
    description: "Sweet fried plantain served with beans stew.",
    price: 7,
    category: "Lunch",
    image: "/menu/beans.png",
    dietaryPreferences: ["Vegetarian"],
    available: true
  },
  {
    _id: "offline-3",
    name: "Chicken Burger",
    description: "Juicy chicken burger with lettuce and cheese.",
    price: 9,
    category: "Fast Food",
    image: "/menu/burger.png",
    dietaryPreferences: [],
    available: true
  },
  {
    _id: "offline-4",
    name: "Iced Coffee",
    description: "Cold brewed coffee with milk and sugar.",
    price: 4,
    category: "Drinks",
    image: "/menu/coffee.png",
    dietaryPreferences: [],
    available: true
  },
  {
    _id: "offline-5",
    name: "Egg Sandwich",
    description: "Simple egg sandwich with mayo and lettuce.",
    price: 4,
    category: "Breakfast",
    image: "/menu/egg.png",
    dietaryPreferences: ["Vegetarian"],
    available: true
  },
  {
    _id: "offline-6",
    name: "French Fries",
    description: "Crispy golden fries with ketchup.",
    price: 3,
    category: "Sides",
    image: "/menu/french-fries.png",
    dietaryPreferences: ["Vegan"],
    available: true
  },
  {
    _id: "offline-7",
    name: "Fried Rice and Chicken",
    description: "Classic fried rice served with crispy chicken.",
    price: 11,
    category: "Lunch",
    image: "/menu/fried-rice.png",
    dietaryPreferences: [],
    available: true
  },
  {
    _id: "offline-8",
    name: "Fruit Smoothie",
    description: "Banana, mango, and strawberry smoothie.",
    price: 5,
    category: "Drinks",
    image: "/menu/fruit-smoothie.png",
    dietaryPreferences: ["Vegan"],
    available: true
  },
  {
    _id: "offline-9",
    name: "Grilled Chicken Salad",
    description: "Healthy grilled chicken with fresh vegetables.",
    price: 9,
    category: "Healthy",
    image: "/menu/grilled-chicken-salad.png",
    dietaryPreferences: ["Low Carb"],
    available: true
  },
  {
    _id: "offline-10",
    name: "Ice Cream Cup",
    description: "Vanilla ice cream with chocolate topping.",
    price: 3,
    category: "Dessert",
    image: "/menu/ice-cream.png",
    dietaryPreferences: ["Vegetarian"],
    available: true
  },
  {
    _id: "offline-11",
    name: "Indomie Special",
    description: "Stir-fried noodles with egg, vegetables, and sausage.",
    price: 6,
    category: "Snacks",
    image: "/menu/indomie.png",
    dietaryPreferences: [],
    available: true
  },
  {
    _id: "offline-12",
    name: "Jollof Rice and Chicken",
    description: "Smoky jollof rice with grilled chicken and fresh salad.",
    price: 12,
    category: "Lunch",
    image: "/menu/jollof.png",
    dietaryPreferences: ["Halal"],
    available: true
  },
  {
    _id: "offline-13",
    name: "Chicken Nuggets",
    description: "Crispy chicken nuggets served with dip.",
    price: 5,
    category: "Snacks",
    image: "/menu/nuggets.png",
    dietaryPreferences: [],
    available: true
  },
  {
    _id: "offline-14",
    name: "Pancake Stack",
    description: "Fluffy pancakes topped with maple syrup and berries.",
    price: 7,
    category: "Breakfast",
    image: "/menu/pancake.png",
    dietaryPreferences: ["Vegetarian"],
    available: true
  },
  {
    _id: "offline-15",
    name: "Pepperoni Pizza Slice",
    description: "Cheesy pizza slice with pepperoni topping.",
    price: 6,
    category: "Fast Food",
    image: "/menu/pizza.png",
    dietaryPreferences: [],
    available: true
  },
  {
    _id: "offline-16",
    name: "Beef Shawarma",
    description: "Spicy beef shawarma wrapped with creamy sauce.",
    price: 7,
    category: "Snacks",
    image: "/menu/shawarma.png",
    dietaryPreferences: ["Halal"],
    available: true
  },
  {
    _id: "offline-17",
    name: "Spaghetti Bolognese",
    description: "Pasta with rich beef tomato sauce.",
    price: 8,
    category: "Lunch",
    image: "/menu/spaghetti.png",
    dietaryPreferences: [],
    available: true
  },
  {
    _id: "offline-18",
    name: "Spring Rolls",
    description: "Crispy vegetable spring rolls with sweet chili sauce.",
    price: 5,
    category: "Snacks",
    image: "/menu/spring-rolls.png",
    dietaryPreferences: ["Vegetarian"],
    available: true
  },
  {
    _id: "offline-19",
    name: "Veggie Wrap",
    description: "Whole wheat wrap with hummus, lettuce, cucumber, and tomato.",
    price: 8,
    category: "Snacks",
    image: "/menu/veggie-wrap.png",
    dietaryPreferences: ["Vegetarian"],
    available: true
  },
  {
    _id: "offline-20",
    name: "Waakye with Fish",
    description: "Rice and beans served with fried fish, spaghetti, and gari.",
    price: 10,
    category: "Lunch",
    image: "/menu/waakye.png",
    dietaryPreferences: [],
    available: true
  }
];
