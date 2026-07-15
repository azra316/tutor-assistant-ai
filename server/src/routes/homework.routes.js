import { Router } from "express";
import { generateHomework } from "../controllers/homework.controller.js";
import { validateHomeworkRequest } from "../middleware/validateHomeworkRequest.js";

const router = Router();

router.post("/generate-homework", validateHomeworkRequest, generateHomework);

export default router;
