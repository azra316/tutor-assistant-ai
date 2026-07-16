import { Router } from "express";
import { generateLessonPlan } from "../controllers/lessonPlan.controller.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { validateLessonPlanRequest } from "../middleware/validateLessonPlanRequest.js";

const router = Router();

router.post("/generate-lesson-plan", requireAuth, validateLessonPlanRequest, generateLessonPlan);

export default router;
