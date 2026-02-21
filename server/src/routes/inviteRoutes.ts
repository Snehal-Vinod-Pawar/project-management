import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import {inviteToProject,acceptProjectInvite,} from "../controllers/inviteController";

const router = Router();

router.post("/projects/invite", protect, inviteToProject);
router.post("/invites/:token/accept", protect, acceptProjectInvite);

export default router;
