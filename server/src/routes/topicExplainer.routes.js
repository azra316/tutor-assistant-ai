import { Router } from "express";
import { explainTopic } from "../controllers/topicExplainer.controller.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { validateTopicExplainerRequest } from "../middleware/validateTopicExplainerRequest.js";
import { traceAiRequest } from "../utils/aiLogger.js";

const router = Router();

router.post(
  "/explain-topic",
  requireAuth,
  traceAiRequest("topic-explainer"),
  validateTopicExplainerRequest,
  explainTopic,
);

export default router;
