import { Router } from "express";
import { generateHomework } from "../controllers/homework.controller.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { validateHomeworkRequest } from "../middleware/validateHomeworkRequest.js";
import { traceAiRequest } from "../utils/aiLogger.js";

const router = Router();

router.post(
  "/generate-homework",
  requireAuth,
  traceAiRequest("homework"),
  validateHomeworkRequest,
  generateHomework,
);

export default router;
