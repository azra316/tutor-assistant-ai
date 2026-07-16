import { Router } from "express";
import {
  deleteResource,
  duplicateResource,
  getResource,
  listResources,
  updateResource,
} from "../controllers/resources.controller.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/api/resources", requireAuth, listResources);
router.get("/api/resources/:id", requireAuth, getResource);
router.put("/api/resources/:id", requireAuth, updateResource);
router.delete("/api/resources/:id", requireAuth, deleteResource);
router.post("/api/resources/:id/duplicate", requireAuth, duplicateResource);

export default router;
