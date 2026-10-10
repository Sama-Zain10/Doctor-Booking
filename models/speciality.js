import mongoose from "mongoose";

const specialitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  icon: { type: String, trim: true },
});

export default mongoose.model("Speciality", specialitySchema);