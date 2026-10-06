import mongoose from "mongoose";
const adminSchema=new mongoose.Schema(
    {
      username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, 
      trim: true,      
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "sub-admin"], 
      required:true,
    }
    },
    {timestamps:true,}
);
const Admin= mongoose.model("Admin",adminSchema);
export default Admin;