import "dotenv/config";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/user.js";
import Speciality from "../models/speciality.js";
import Doctor from "../models/doctor.js";
import Appointment from "../models/appointment.js";

await mongoose.connect(process.env.MONGO_URI);

const DOCTOR_EMAIL = "seed.doctor@example.com";
const patient = await User.findOne({ email: (process.env.SEED_PATIENT_EMAIL || "").toLowerCase() });

if (!patient) {
  console.error("Set SEED_PATIENT_EMAIL in .env to an existing patient email");
  process.exit(1);
}

// node scripts/seedTestData.js --clean   يمسح اللي السكريبت عمله
if (process.argv.includes("--clean")) {
  const docUser = await User.findOne({ email: DOCTOR_EMAIL });
  if (docUser) {
    const doc = await Doctor.findOne({ user_id: docUser._id });
    if (doc) await Appointment.deleteMany({ doctor_id: doc._id });
    await Doctor.deleteMany({ user_id: docUser._id });
    await User.deleteOne({ _id: docUser._id });
  }
  await Speciality.deleteOne({ name: "أخصائي طب الأطفال" });
  console.log("Seed data removed");
  await mongoose.disconnect();
  process.exit(0);
}

const speciality = await Speciality.findOneAndUpdate(
  { name: "أخصائي طب الأطفال" },
  { name: "أخصائي طب الأطفال" },
  { upsert: true, new: true }
);

let docUser = await User.findOne({ email: DOCTOR_EMAIL });
if (!docUser) {
  docUser = await User.create({
    full_name: "د. سارة إبراهيم رضا",
    email: DOCTOR_EMAIL,
    password: await bcrypt.hash(crypto.randomBytes(16).toString("hex"), 12),
    gender: "female",
    governorate: "Cairo",
    role: "doctor",
  });
}

let doctor = await Doctor.findOne({ user_id: docUser._id });
if (!doctor) {
  doctor = await Doctor.create({
    user_id: docUser._id,
    speciality_id: speciality._id,
    bio: "طبيبة أطفال",
    clinic_address: "مركز المعادي للأطفال · شارع 9، المعادي، القاهرة",
    consultation_fee: 350,
  });
}

const day = (offset) => {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() + offset);
  return d;
};

await Appointment.deleteMany({ patient_id: patient._id, booking_reference: /^SEED-/ });

await Appointment.create([
  { patient_id: patient._id, doctor_id: doctor._id, appointment_date: day(2),  appointment_time: "18:30", status: "upcoming",  booking_reference: "SEED-0001" },
  { patient_id: patient._id, doctor_id: doctor._id, appointment_date: day(-5), appointment_time: "17:00", status: "completed", booking_reference: "SEED-0002" },
  { patient_id: patient._id, doctor_id: doctor._id, appointment_date: day(-9), appointment_time: "19:00", status: "cancelled", booking_reference: "SEED-0003" },
]);
console.log("Doctor id:", doctor._id.toString());
console.log("Seed done for", patient.email);
await mongoose.disconnect();