import mongoose from "mongoose";

const drSchema = new mongoose.Schema({
  
  name: {
    type: String,
    required: true,
    minlength: 4
  },

  specialty: {
     type: String,
     enum:["Dentistry","Cardiology", "Dermatology", "Endocrinology", "Gastroenterology", 
    "Neurology", "Obstetrics & Gynecology", "Ophthalmology", 
    "Orthopedics", "ENT", "Pediatrics", "Psychiatry", 
    "Pulmonology", "Urology", "Rheumatology"],
      required: true },
      fee: {
    type: Number,
    required: true,
    min: 50,
    max: 500
  },

  day: { 
    type: String,
    enum: ["saturday", "sunday", "monday", "tuesday", "wednesday", "thursday","friday"],
     required: true,
     lowercase: true
    },

  hour: {
     type: String,
      required: true },

  maxBooking: {
     type: Number,
      default: 20 },

  isActive: { 
    type: Boolean,
     default: true }
}, { timestamps: true });


const Dr = mongoose.model("Dr", drSchema);

export default Dr;