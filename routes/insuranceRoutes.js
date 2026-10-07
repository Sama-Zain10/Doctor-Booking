import { Router } from "express";
import {
  addInsurance,
  getInsurance,
} from "../controllers/insuranceController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect, authorize("patient"));

router.post("/", addInsurance);
router.get("/", getInsurance);

export default router;
