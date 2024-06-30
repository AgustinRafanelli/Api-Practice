import { Router } from "express";
import { getUser, getUsers } from "../controllers/userController";

const router = Router();

router.get("/user", getUser);
router.get("/users", getUsers);

export default router;
