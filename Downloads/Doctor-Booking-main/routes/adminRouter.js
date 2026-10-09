import { Router } from "express";
import rateLimit from "express-rate-limit";
import { protect } from "../middleware/authMiddleware.js";
import {createDoctor,
} from "../controllers/drcontroller.js";
import {createAdmin,admingetDoctors,createManyDoctors,
    acceptDoctor,cancellDoctor,activateDoctor,deactivateDoctor
} from "../controllers/adminController.js";

import{createManySpecialities,createSpeciality,getAllSpecialities,
    getSpecialityById,activateSpeciality,deactivateSpeciality,updateExistingSpecialitiesStatus
} from"../controllers/specialtyController.js";


const router = Router();

//only admin:
router.post("/",createAdmin)

router.post("/addmanyspec",createManySpecialities)
router.post("/addspec",createSpeciality)
router.get("/admingetallspec",getAllSpecialities)
router.get("/admingetonespec/:id",getSpecialityById)
router.patch("/activatespec/:id",activateSpeciality)
router.patch("/deactivatespec/:id",deactivateSpeciality)
router.patch("/activateallspec",updateExistingSpecialitiesStatus)

router.post("/adminaddmanydrs",createManyDoctors)
router.post("/adddoctor",createDoctor)

router.get("/adminviewdr",admingetDoctors)

router.patch("/adminacceptdr/:id",acceptDoctor)
router.patch("/admincancelldr/id",cancellDoctor)
router.patch("/adminactivatedr/id",activateDoctor)
router.patch("/admindeactivatedr/id",deactivateDoctor)



export default router;