import mongoose from "mongoose";

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/; // "18:30"

const availabilitySchema = new mongoose.Schema(
  {
    day_of_week: { type: Number, required: true, min: 0, max: 6 }, 
    start_time:  { type: String, required: true, match: TIME_REGEX },
    end_time: {
      type: String,
      required: true,
      match: TIME_REGEX,
      validate: {
        validator: function (v) {
          return this.start_time < v;
        },
        message: "end_time must be after start_time",
      },
    },
  },
  { _id: false }
);

const doctorSchema = new mongoose.Schema(
  {
    user_id:       { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    speciality_id: { type: mongoose.Schema.Types.ObjectId, ref: "Speciality", required: true },

    bio:                          { type: String, trim: true },
    education_and_qualifications: { type: String, trim: true },
    clinic_address:               { type: String, trim: true },
    consultation_fee:             { type: Number, required: true, min: 0 },
    rating_average:               { type: Number, default: 0, min: 0, max: 5 },

    title:                 { type: String, trim: true },           
    image:                 { type: String, trim: true, default: null },
    years_of_experience:   { type: Number, default: 0, min: 0 },   
    clinic_name:           { type: String, trim: true },           
    area:                  { type: String, trim: true },        
    governorate:           { type: String, trim: true },           
    rating_count:          { type: Number, default: 0, min: 0 },  
    availability:          { type: [availabilitySchema], default: [] },
    slot_duration_minutes: { type: Number, default: 30, min: 5, max: 240 },
    days_off:              { type: [Date], default: [] },          

    clinic_phone:   { type: String, trim: true },
    languages:      { type: [String], default: [] },
    license_number: { type: String, trim: true, unique: true, sparse: true }, 
    location: {                                                   
      latitude:  { type: Number, min: -90, max: 90 },
      longitude: { type: Number, min: -180, max: 180 },
    },
    is_active: { type: Boolean, default: true },         
    
    approval_status: {
  type: String,
  enum: ["pending", "accepted", "cancelled"],
  default: "pending"
}

  },
  { timestamps: true }
);

doctorSchema.index({ speciality_id: 1 });
doctorSchema.index({ governorate: 1, area: 1 });
doctorSchema.index({ is_active: 1, rating_average: -1 });

export default mongoose.model("Doctor", doctorSchema);