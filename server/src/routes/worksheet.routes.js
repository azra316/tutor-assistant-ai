import { Router } from "express";
import { generateWorksheet } from "../controllers/worksheet.controller.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { validateWorksheetRequest } from "../middleware/validateWorksheetRequest.js";

const router = Router();

router.post("/generate-worksheet", requireAuth, validateWorksheetRequest, generateWorksheet);

export default router;
