import { Router } from "express";

import { getTeams,createTeam } from "../controllers/teamController";
import { protect } from "../middleware/authMiddleware";
import { addUserToTeam } from "../controllers/teamController";

const router = Router();

router.post("/", protect, createTeam);
router.get("/", protect,getTeams);
router.post("/:teamId/invite", protect, addUserToTeam);

export default router;