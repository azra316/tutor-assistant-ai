import { Router } from "express";
import { generateLessonPlan } from "../controllers/lessonPlan.controller.js";
import { validateLessonPlanRequest } from "../middleware/validateLessonPlanRequest.js";

const router = Router();

router.post("/generate-lesson-plan", validateLessonPlanRequest, generateLessonPlan);

export default router;
