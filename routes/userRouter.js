import { Router } from "express";
import {
  updateProfile,
  changePassword,
    getProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect); 

router.put("/profile", updateProfile);
router.post("/change-password", changePassword);
router.get("/get-profile", getProfile);
// router.get("/appointments", getMyAppointments);
// router.get("/insurance", getInsurance);
// router.post("/insurance", addInsurance);

export default router;