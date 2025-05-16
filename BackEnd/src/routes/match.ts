import { Router } from "express";
import { createMatch } from "../controllers/matchcontroller";

const router = Router();

router.post("/", createMatch);

export default router;
