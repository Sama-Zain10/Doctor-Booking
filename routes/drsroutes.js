import express from "express";
import{VDrsBySpecialtyAdmin,activateDoctor,deactivateDoctor,deleteDr,addmanyDrs} from"../controllers/drcontrollers.js";
import { protectA,allowRoles } from "../middleware/auth.js";


const router= express.Router();

router.get("/viewdrsbyspecialty",protectA,VDrsBySpecialtyAdmin);

router.post("/many",protectA,addmanyDrs);

router.patch("/activatedr/:id",protectA,activateDoctor);

router.patch("/deactivatedr/:id",protectA,deactivateDoctor);


router.delete("/delete/:id",protectA,allowRoles("admin"), deleteDr);


export default router;

