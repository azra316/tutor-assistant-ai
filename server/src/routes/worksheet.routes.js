import { Router } from "express";
import { generateWorksheet } from "../controllers/worksheet.controller.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { validateWorksheetRequest } from "../middleware/validateWorksheetRequest.js";
import { traceAiRequest } from "../utils/aiLogger.js";

const router = Router();

router.post(
  "/generate-worksheet",
  requireAuth,
  traceAiRequest("worksheet"),
  validateWorksheetRequest,
  generateWorksheet,
);

export default router;
