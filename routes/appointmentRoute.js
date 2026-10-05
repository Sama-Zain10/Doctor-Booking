import { Router } from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = Router();

// router.post("/book", protect, authorize("patient"), bookAppointment);

export default router;