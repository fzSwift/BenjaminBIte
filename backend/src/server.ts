import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { connectDB } from "./config/db";
import userRoutes from "./routes/userRoutes";
import menuRoutes from "./routes/menuRoutes";
import cartRoutes from "./routes/cartRoutes";
import orderRoutes from "./routes/orderRoutes";

dotenv.config();

const app = express();

const normalizeOrigin = (value: string): string => value.trim().replace(/\/+$/, "");
const configuredOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => normalizeOrigin(origin))
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser clients (e.g. curl, health checks) with no Origin header.
      if (!origin) {
        callback(null, true);
        return;
      }

      const requestOrigin = normalizeOrigin(origin);
      const isAllowed = configuredOrigins.includes(requestOrigin);
      callback(isAllowed ? null : new Error("CORS blocked for this origin"), isAllowed);
    }
  })
);
app.use(express.json());
app.use("/menu", express.static(path.resolve(__dirname, "..", "..", "frontend", "public", "menu")));

app.get("/api/health", (_req, res) => {
  res.json({ message: "Benjamin Bite API is running" });
});

app.use("/api/user", userRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

const port = Number(process.env.PORT) || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

connectDB().catch((error) => {
  console.error("Database connection failed. Running in fallback mode for menu endpoints.", error);
});
