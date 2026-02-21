import { Router } from "express";
import passport from "passport";
import { oauthSuccess } from "../controllers/authController";

const router = Router();

// ===== Google OAuth =====
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  oauthSuccess
);

// ===== GitHub OAuth =====
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  oauthSuccess
);

export default router;
