import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    user_id:       { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    speciality_id: { type: mongoose.Schema.Types.ObjectId, ref: "Speciality", required: true },
    bio:           { type: String, trim: true },
    education_and_qualifications: { type: String, trim: true },
    clinic_address: { type: String, trim: true },
    consultation_fee: { type: Number, required: true, min: 0 },
    rating_average:   { type: Number, default: 0, min: 0, max: 5 },
    rating_count:     { type: Number, default: 0, min: 0 }, 
  },
  { timestamps: true }
);

doctorSchema.index({ speciality_id: 1 });

export default mongoose.model("Doctor", doctorSchema);