import express from "express";
import {pregister,verifyEmail,patientLogin} from "../controllers/pcontrollers.js";

const router=express.Router();


router.post("/reg",pregister);

router.post("/verify",verifyEmail);

router.post("/plogin",patientLogin);

export default router;
