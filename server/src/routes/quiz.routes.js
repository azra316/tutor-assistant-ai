import { Router } from "express";
import { generateQuiz } from "../controllers/quiz.controller.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { validateQuizRequest } from "../middleware/validateQuizRequest.js";
import { traceAiRequest } from "../utils/aiLogger.js";

const router = Router();

router.post("/generate-quiz", requireAuth, traceAiRequest("quiz"), validateQuizRequest, generateQuiz);

export default router;
