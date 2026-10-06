import { Router } from "express";
import {
  addInsurance,
  getInsurance,
} from "../controllers/insuranceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);

router.post("/", addInsurance);
router.get("/", getInsurance);

export default router;
