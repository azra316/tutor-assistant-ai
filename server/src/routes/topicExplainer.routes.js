import { Router } from "express";
import { explainTopic } from "../controllers/topicExplainer.controller.js";
import { validateTopicExplainerRequest } from "../middleware/validateTopicExplainerRequest.js";

const router = Router();

router.post("/explain-topic", validateTopicExplainerRequest, explainTopic);

export default router;
