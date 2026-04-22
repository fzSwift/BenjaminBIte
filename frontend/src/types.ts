export interface User {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
  tier?: string;
}

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  dietaryPreferences: string[];
  available: boolean;
}
