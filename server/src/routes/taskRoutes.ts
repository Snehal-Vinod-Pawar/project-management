import { Router } from "express";
import {
  createTask,
  getTasks,
  getUserTasks,
  updateTaskStatus,
  getTasksByPriority,
  deleteTask 
} from "../controllers/taskController";
import { protect } from "../middleware/authMiddleware";
import { uploadTaskImage } from "../middleware/upload";

const router = Router();

router.get("/",protect,getTasks);
router.post("/",protect,uploadTaskImage.single("image"),createTask);
router.patch("/:taskId/status", protect,updateTaskStatus);
router.get("/user/:userId", protect,getUserTasks);
router.get("/priority/:priority", protect, getTasksByPriority);
router.delete("/:taskId", protect, deleteTask);

export default router;