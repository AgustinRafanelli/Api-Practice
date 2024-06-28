import { Router } from "express";
import { getUsers, createUser } from "../controllers/userController";

const router = Router();

router.get("/users", getUsers);
router.get("/user/*", getUsers);
router.post("/user", createUser);

export default router;
