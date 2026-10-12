import bcrypt from "bcryptjs";
import User from "../models/user.js";
import {createAdminSchema,} from "../validators/authValidator.js";
import Dr from "../models/doctor.js";
import Speciality from "../models/speciality.js";




export const acceptDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dr = await Dr.findById(id);

    if (!dr) return next({ message: "Doctor not found", statusCode: 404 });

    if (dr.approval_status === "accepted") {
      return res.status(400).json({ success: false, message: "Doctor is already accepted" });
    }

    dr.approval_status = "accepted";
    await dr.save();

    res.status(200).json({ success: true, message: `Dr. ${dr.name} is now active` });
  } catch (err) {
    next(err);
  }
};


export const cancellDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dr = await Dr.findById(id);

    if (!dr) return next({ message: "Doctor not found", statusCode: 404 });

    if (dr.approval_status === "cancelled") {
      return res.status(400).json({ success: false, message: "Doctor is already cancelled" });
    }

    dr.approval_status = "cancelled";
    await dr.save();

    res.status(200).json({ success: true, message: `Dr. ${dr.name} is now active` });
  } catch (err) {
    next(err);
  }
};


export const activateDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dr = await Dr.findById(id);

    if (!dr) return next({ message: "Doctor not found", statusCode: 404 });

    if (dr.is_active === true) {
      return res.status(400).json({ success: false, message: "Doctor is already active" });
    }

    dr.is_active = true;
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


    if (dr.is_active === false) {
      return res.status(400).json({ success: false, message: "Doctor is already deactivated" });
    }

    dr.is_active = false;
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



export const createAdmin = async (req, res, next) => {
  try {
    const { error, value } = createAdminSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return next({
        message: error.details.map((d) => d.message).join(", "),
        statusCode: 400,
      });
    }

    const exists = await User.findOne({
      email: value.email.toLowerCase(),
    });

    if (exists) {
      return next({
        message: "Email already registered",
        statusCode: 409,
      });
    }

    const hashed = await bcrypt.hash(value.password, 12);

    const admin = await User.create({
      ...value,
      password: hashed,
      role: "admin",
    });

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: {
        id: admin._id,
        full_name: admin.full_name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      return next({
        message: "Email already registered",
        statusCode: 409,
      });
    }

    next(err);
  }
};








export const admingetDoctors = async (req, res, next) => {
  try {
    const {
      approval_status,
      is_active,
      speciality_id,
      governorate
    } = req.query;

    const filter = {};

if (approval_status) {
  filter.approval_status = approval_status;
}

if (is_active === "true") {
  filter.is_active = true;
}

if (is_active === "false") {
  filter.is_active = false;
}

    
    if (speciality_id) {
      filter.speciality_id = speciality_id;
    }

   
    if (governorate) {
      filter.governorate = governorate;
    }

    const doctors = await Dr.find(filter)
      .populate("user_id", "full_name email")
      .populate("speciality_id", "name")
      .select(
        "user_id speciality_id title image consultation_fee rating_average area governorate is_active approval_status"
      )
      .sort({ rating_average: -1 });

    const result = doctors.map((doctor) => ({
      doctor_id: doctor._id,
      name: doctor.user_id?.full_name,
      email: doctor.user_id?.email,
      speciality: doctor.speciality_id?.name,
      image: doctor.image,
      rating: doctor.rating_average,
      is_active: doctor.is_active,
      approval_status: doctor.approval_status,
      
    }));

    res.status(200).json({
      success: true,
      count: result.length,
      data: result
    });

  } catch (err) {
    next(err);
  }
};















export const createManyDoctors = async (req, res, next) => {
  try {
    const doctors = req.body;

    if (!Array.isArray(doctors) || doctors.length === 0) {
      return next({
        message: "Please send an array of doctors",
        statusCode: 400
      });
    }

    const createdDoctors = [];

    for (const doctorData of doctors) {
      const {
        full_name,
        email,
        password,
        phone,
        speciality_id,
        title,
        bio,
        education_and_qualifications,
        clinic_address,
        consultation_fee,
        years_of_experience,
        clinic_name,
        area,
        governorate,
        clinic_phone,
        languages,
        license_number,
        location,
        availability,
        slot_duration_minutes
      } = doctorData;

      if (!full_name || !email || !password || !speciality_id) {
        continue;
      }

      const speciality = await Speciality.findById(speciality_id);

      if (!speciality) {
        continue;
      }

      const existingUser = await User.findOne({
        email: email.toLowerCase()
      });

      if (existingUser) {
        continue;
      }

      if (license_number) {
        const existingDoctor = await Dr.findOne({
          license_number
        });

        if (existingDoctor) {
          continue;
        }
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await User.create({
        full_name,
        email: email.toLowerCase(),
        phone,
        password: hashedPassword,
        role: "doctor"
      });

      const doctor = await Dr.create({
        user_id: user._id,
        speciality_id: speciality._id,
        title,
        bio,
        education_and_qualifications,
        clinic_address,
        consultation_fee,
        years_of_experience,
        clinic_name,
        area,
        governorate,
        clinic_phone,
        languages,
        license_number,
        location,
        availability,
        slot_duration_minutes,
        approval_status: "accepted",
        is_active: true
      });

      createdDoctors.push({
        doctor_id: doctor._id,
        user_id: user._id,
        full_name: user.full_name,
        email: user.email,
        speciality: speciality.name
      });
    }

    res.status(201).json({
      success: true,
      message: "Doctors created successfully",
      count: createdDoctors.length,
      data: createdDoctors
    });

  } catch (err) {
    next(err);
  }
};