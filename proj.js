import cors from 'cors'
import "./cronalarm.js";
import morgan from "morgan";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import AIRouter from "./routes/aiRoutes.js"
import drRouter from "./routes/drsroutes.js";
import pRouter from "./routes/patientroutes.js"
import authRouter from "./routes/adminroutes.js";
import { ErrorHandler } from "./utils/ErrorHandler.js";

dotenv.config();


const app = express();
app.use(express.json())
app.use(morgan("dev"));





app.use(express.json());


app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON format"
    });
  }
  next(err);
});


app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});



const PORT = process.env.PORT || 3000;


app.use("/api/auth",authRouter);
app.use("/api/dr",drRouter);
app.use("/api/patient",pRouter);
app.use("/api/ai",AIRouter);








async function DBConnection() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to db");
  } catch (err) {
    console.log("error connecting to db");
    console.error(err);
    process.exit(1);
  }
}

DBConnection();

app.use((req, res, next) => {
  next({
    message: `Route not found: ${req.originalUrl}`,
    statusCode: 404
  });
});





app.use(ErrorHandler);
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.error("Critical Error:", err);
  process.exit(1);
});