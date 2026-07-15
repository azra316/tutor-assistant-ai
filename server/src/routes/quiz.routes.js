import { Router } from "express";
import { generateQuiz } from "../controllers/quiz.controller.js";
import { validateQuizRequest } from "../middleware/validateQuizRequest.js";

const router = Router();

router.post("/generate-quiz", validateQuizRequest, generateQuiz);

export default router;
