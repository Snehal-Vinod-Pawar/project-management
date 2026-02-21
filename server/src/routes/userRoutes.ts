import { Router } from "express";

import { getUsers, postUser, deleteUser } from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.get("/", protect,getUsers);
router.post("/",protect, postUser);
router.delete("/:id", protect, deleteUser);

export default router;