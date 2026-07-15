import { Router } from "express";
import { generateWorksheet } from "../controllers/worksheet.controller.js";
import { validateWorksheetRequest } from "../middleware/validateWorksheetRequest.js";

const router = Router();

router.post("/generate-worksheet", validateWorksheetRequest, generateWorksheet);

export default router;
