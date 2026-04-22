import { Router } from "express";
import { createMenuItem, getMenuItems, searchMenuItems, updateMenuItem } from "../controllers/menuController";
import { protect } from "../middleware/authMiddleware";
import { roleCheck } from "../middleware/roleMiddleware";

const router = Router();

router.get("/", getMenuItems);
router.get("/search", searchMenuItems);
router.post("/", protect, roleCheck("admin"), createMenuItem);
router.put("/:id", protect, roleCheck("admin"), updateMenuItem);

export default router;
