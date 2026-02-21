"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
// Email Auth
router.post("/register", authController_1.registerUser);
router.post("/login", authController_1.loginUser);
router.post("/logout", authController_1.logoutUser);
router.get("/me", authMiddleware_1.requireAuth, authController_1.getMe);
exports.default = router;
