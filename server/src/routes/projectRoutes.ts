import { Router } from "express";
import { createProject, getProjects, inviteUserToProject,deleteProject,renameProject,assignProjectToTeam   } from "../controllers/projectController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.get("/",protect, getProjects);
router.post("/", protect,createProject);
router.post("/:projectId/invite", protect, inviteUserToProject);
router.delete("/:projectId", protect, deleteProject);
router.patch("/:projectId", protect, renameProject);
router.post("/assign-team", protect, assignProjectToTeam);

export default router;