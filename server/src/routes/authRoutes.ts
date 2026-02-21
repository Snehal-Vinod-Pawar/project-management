import { Router } from "express";
import passport from "passport";
import { requireAuth } from "../middleware/authMiddleware";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
} from "../controllers/authController";

const router = Router();

// Email Auth
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me",requireAuth,getMe);

export default router;