import { Router } from "express";
import { generateLessonPlan } from "../controllers/lessonPlan.controller.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { validateLessonPlanRequest } from "../middleware/validateLessonPlanRequest.js";
import { traceAiRequest } from "../utils/aiLogger.js";

const router = Router();

router.post(
  "/generate-lesson-plan",
  requireAuth,
  traceAiRequest("lesson-plan"),
  validateLessonPlanRequest,
  generateLessonPlan,
);

export default router;
