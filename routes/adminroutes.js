import express from "express";

import {register,login} from "../controllers/authcontrollers.js";

import { protectA,protectP,allowRoles } from "../middleware/auth.js";


const router=express.Router();


router.post("/adminreg",protectA,allowRoles("admin"),register);

router.post("/adminlogin",login);


export default router;