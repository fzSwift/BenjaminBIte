import { Router } from "express";
import {
  createOrder,
  filterOrdersAdmin,
  getAllOrders,
  getOrderHistoryAdmin,
  getUserOrders,
  redeemOrderPoints,
  searchOrdersAdmin,
  updateOrderStatus
} from "../controllers/orderController";
import { protect } from "../middleware/authMiddleware";
import { roleCheck } from "../middleware/roleMiddleware";

const router = Router();

router.use(protect);
router.post("/", createOrder);
router.get("/admin", roleCheck("admin"), getAllOrders);
router.get("/admin/search", roleCheck("admin"), searchOrdersAdmin);
router.get("/admin/filter", roleCheck("admin"), filterOrdersAdmin);
router.get("/admin/:orderId/history", roleCheck("admin"), getOrderHistoryAdmin);
router.put("/:orderId/status", roleCheck("admin"), updateOrderStatus);
router.post("/:orderId/redeem", redeemOrderPoints);
router.get("/:userId", getUserOrders);

export default router;
