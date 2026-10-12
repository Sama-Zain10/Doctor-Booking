import Admin from "../models/admin.js";
import Dr from "../models/doctor.js";


export const VDrsBySpecialtyAdmin = async (req, res, next) => {
  try {
    const { specialty } = req.query;

    const doctors = await Dr.find({ specialty });

    res.json({
      success: true,
      data: doctors
    });

  } catch (err) {
    next(err);
  }
};



export const addmanyDrs = async (req, res, next) => {
  try {

    if (!Array.isArray(req.body)) {
      return next({
        message: "Body must be an array",
        statusCode: 400
      });
    }

    const drs = await Dr.insertMany(req.body);

    res.status(201).json({
      success: true,
      data: drs
    });

  } catch (err) {

    next(err);
  }
};



export const activateDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dr = await Dr.findById(id);

    if (!dr) return next({ message: "Doctor not found", statusCode: 404 });

    if (dr.isActive === true) {
      return res.status(400).json({ success: false, message: "Doctor is already active" });
    }

    dr.isActive = true;
    await dr.save();

    res.status(200).json({ success: true, message: `Dr. ${dr.name} is now active` });
  } catch (err) {
    next(err);
  }
};


export const deactivateDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dr = await Dr.findById(id);

    if (!dr) return next({ message: "Doctor not found", statusCode: 404 });

    // Check if already deactivated
    if (dr.isActive === false) {
      return res.status(400).json({ success: false, message: "Doctor is already deactivated" });
    }

    dr.isActive = false;
    await dr.save();

    res.status(200).json({ success: true, message: `Dr. ${dr.name} is now deactivated` });
  } catch (err) {
    next(err);
  }
};



export const deleteDr = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dr = await Dr.findByIdAndDelete(id);

    if (!dr) {
      return next({ message: "Doctor not found", statusCode: 404 });
    }

    res.json({
      success: true,
      message: "Doctor deleted successfully"
    });
  } catch (err) {
    next(err);
  }
};

