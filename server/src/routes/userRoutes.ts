import { Router } from "express";

import { getUsers, postUser } from "../controllers/UserController";

const router = Router();

router.get("/", getUsers);
router.post("/", postUser);
// router.get("/:cognitoId", getUser);

export default router;