import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboard.controller.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/api/dashboard/stats", requireAuth, getDashboardStats);

export default router;
