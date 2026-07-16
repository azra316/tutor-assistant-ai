import { Router } from "express";
import { generateHomework } from "../controllers/homework.controller.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { validateHomeworkRequest } from "../middleware/validateHomeworkRequest.js";

const router = Router();

router.post("/generate-homework", requireAuth, validateHomeworkRequest, generateHomework);

export default router;
