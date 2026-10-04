import mongoose from "mongoose";

const patientSchema=new mongoose.Schema({

  name: { type: String, minlength:7, required: true, },

 email: { 
    type: String, 
    minlength:8,
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true       
  },

  password: { type: String,  minlength:4,required: true },
  verificationToken: { type: String },

  isVerified: { type: Boolean, default: false },
  
  
role: { 
  type: String, 
  default: "patient", 
  immutable: true 
},
    
  
}, { timestamps: true });

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;

