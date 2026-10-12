import mongoose from "mongoose";

const medicalInsuranceSchema = new mongoose.Schema(
  {
    patient_id:        { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    insurance_company: { type: String, required: true, trim: true },
    card_number:       { type: String, required: true }, 
    card_last4:        { type: String, required: true },
    expiry_date:       { type: Date, required: true },
    card_image:        { type: String, default: null },
    status:            { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

medicalInsuranceSchema.index({ patient_id: 1 });

export default mongoose.model("MedicalInsurance", medicalInsuranceSchema);