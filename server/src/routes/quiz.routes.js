import { Router } from "express";
import { generateQuiz } from "../controllers/quiz.controller.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { validateQuizRequest } from "../middleware/validateQuizRequest.js";

const router = Router();

router.post("/generate-quiz", requireAuth, validateQuizRequest, generateQuiz);

export default router;
