import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Patient from "../models/patient.js"
import {sendEmail} from "../utils/SendEmail.js";
import {config} from "dotenv";

config();


export async function pregister(req, res, next) {
  try {
    console.log("Register route hit");
    console.log("BODY:", req.body);
    let { name, email, password, age, gender, phone, bloodType,medicalhistory} = req.body;

    
    if (!name || !email || !password || !age||!gender|| !phone||!bloodType||!medicalhistory) {
      return next({ message: "Required fields are missing", statusCode: 400 });
    }
email = email.trim().toLowerCase();
    
    const exists = await Patient.findOne({ email });
    if (exists) {
      return next({ message: "User already exists", statusCode: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    //const expires = new Date(Date.now() + 40 * 60 * 1000); 

    const patient = await Patient.create({
      name,
      email,
      password: hashedPassword,
      age,
      gender,
      phone,
      bloodType,
      medicalhistory,
      verificationToken, 
      //verificationTokenExpires: expires,
      isVerified: false
    });

    try {

const subject = "Email Verification";
const htmlContent = `
  <div style="font-family: sans-serif; text-align: center; border: 1px solid #eee; padding: 20px;">
    <h1 style="color: #2c3e50;">Email Verification</h1>
    <p>Use the following code to complete your registration:</p>
    <h2 style="background: #f8f9fa; display: inline-block; padding: 10px 20px; color: #e74c3c; letter-spacing: 2px;">
      ${verificationToken}
    </h2>
    <p style="font-size: 0.8rem; color: #7f8c8d;">This helps our AI categorize your health data correctly.</p>
  </div>
`;

await sendEmail(patient.email, subject, htmlContent);
  
}  catch (error) {

  console.log(error);

  await Patient.findByIdAndDelete(patient._id);

  return next({
    message: error.message,
    statusCode: 500
  });
}
    res.status(201).json({
      success: true,
      message: "Registration successful. Please verify your email.",
    });
  } catch (err) {
    next(err);
  }
}

export async function verifyEmail(req, res, next) {
  try {
    let { email, code } = req.body;
    email = email.trim().toLowerCase();

    const patient = await Patient.findOne({ email });

    if (!patient || patient.verificationToken !== code) {
      return next({ message: "Invalid verification code", statusCode: 400 });
    }

    //if (Date.now() > patient.verificationTokenExpires) {
    //  return next({ message: "Verification code has expired. Please register again.", statusCode: 400 });
    //}

    patient.isVerified = true;
    patient.verificationToken = undefined; // Clear the code
  //  patient.verificationTokenExpires = undefined; // Clear expiration too
    await patient.save();

    res.json({ success: true, message: "Email verified successfully. You can now login." });
  } catch (err) {
    next(err);
  }
}





export async function patientLogin(req, res, next) {
  try {
    let { email, password } = req.body;
    email = email.trim().toLowerCase();

    const patient = await Patient.findOne({ email });
    if (!patient) {
      return next({ message: "Invalid credentials", statusCode: 400 });
    }

   
    if (!patient.isVerified) {
      return next({ message: "Please verify your email first", statusCode: 401 });
    }

    const match = await bcrypt.compare(password, patient.password);
    if (!match) {
      return next({ message: "Invalid credentials", statusCode: 400 });
    }

    const token = jwt.sign(
      { id: patient._id, role: "patient" },
      process.env.JWT_SECRET,
      { expiresIn: "24h" } // Patients usually get longer sessions than admins
    );

    res.json({ 
      success: true, 
      token, 
      patientName: patient.name 
    });
  } catch (err) {
    next(err);
  }
}







//export async function resendVerificationCode(req, res, next) {
  //try {
  //  const { email } = req.body;
  //  email = email.trim().toLowerCase();
    

  //  const patient = await Patient.findOne({ email });

  // if (!patient) {
  //    return next({ message: "User not found", statusCode: 404 });
  //  }

  //  if (patient.isVerified) {
     // return next({ message: "This account is already verified", statusCode: 400 });
  //  }

    //const newCode = Math.floor(100000 + Math.random() * 900000).toString();
   // const newExpires = new Date(Date.now() + 15 * 60 * 1000);

   // patient.verificationToken = newCode;
    //patient.verificationTokenExpires = newExpires;
   // await patient.save();

   // try {
     // await sendEmail({
     //   email: patient.email,
       // subject: "Your New Verification Code",
      //  code: newCode,
      //});
   // } catch (error) {
    //  return next({ message: "Failed to send email", statusCode: 500 });
   // }

   // res.json({ success: true, message: "A new code has been sent to your email." });
  //} catch (err) {
  //  next(err);
  //}
//}