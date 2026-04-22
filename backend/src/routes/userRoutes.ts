import { Router } from "express";
import { getProfile, getUserPoints, loginUser, registerUser, updateProfile } from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile/:id", protect, getProfile);
router.put("/update", protect, updateProfile);
router.get("/:userId/points", protect, getUserPoints);

export default router;
