import mongoose from "mongoose";

const insuranceSchema = new mongoose.Schema(
  {
    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    insurance_company: {
      type: String,
      required: true,
      trim: true,
    },
    policy_holder_name: {
      type: String,
      required: true,
      trim: true,
    },
    card_number: {
      type: String,
      required: true,
      trim: true,
    },
    expiry_date: {
      type: Date,
      required: true,
    },
    card_image: {
      type: String,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

export default mongoose.model("Insurance", insuranceSchema);
