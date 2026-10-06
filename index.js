import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import express from "express";

import connectDB from "./config/db.js";
import authRouter from "./routes/authRouter.js";
import doctorRouter from "./routes/doctorRouter.js";
import appointmentRouter from "./routes/appointmentRoute.js";
import userRouter from "./routes/userRouter.js";
import AIRouter from "./routes/aiRoutes.js";
import insuranceRouter from "./routes/insuranceRoutes.js";
import { ErrorHandler } from "./utils/ErrorHandler.js";

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Middlewares ----------
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Invalid JSON body
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ success: false, message: "Invalid JSON format" });
  }
  next(err);
});

// ---------- Routes ----------
app.use("/api/auth", authRouter);
app.use("/api/doctors", doctorRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/user", userRouter);
app.use("/api/insurance", insuranceRouter);
app.use("/api/ai", AIRouter);

// ---------- 404 + Error handler ----------
app.use((req, res, next) => {
  next({ message: `Route not found: ${req.originalUrl}`, statusCode: 404 });
});
app.use(ErrorHandler);

// ---------- Start ----------
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
});


process.on("unhandledRejection", (err) => {
  console.error("Critical Error:", err);
  process.exit(1);
});