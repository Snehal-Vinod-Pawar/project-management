"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const inviteController_1 = require("../controllers/inviteController");
const router = (0, express_1.Router)();
router.post("/projects/invite", authMiddleware_1.protect, inviteController_1.inviteToProject);
router.post("/invites/:token/accept", authMiddleware_1.protect, inviteController_1.acceptProjectInvite);
exports.default = router;
