import { Router } from "express";
import { addToCart, checkoutCart, getCart, removeCartItem, updateCartItemQuantity } from "../controllers/cartController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.use(protect);
router.post("/", addToCart);
router.get("/", getCart);
router.put("/:menuItemId", updateCartItemQuantity);
router.delete("/:menuItemId", removeCartItem);
router.post("/checkout", checkoutCart);

export default router;
