import bcrypt from "bcryptjs";
import User from "../models/user.js";
import {
  updateProfileSchema,
  changePasswordSchema,
} from "../validators/userValidator.js";
import BlacklistedToken from "../models/blacklistedToken.js";

export const updateProfile = async (req, res, next) => {
  try {
    const { error, value } = updateProfileSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      return next({
        message: error.details.map((d) => d.message).join(", "),
        statusCode: 400,
      });
    }

    const user = await User.findByIdAndUpdate(req.user.id, value, {
      new: true,
      runValidators: true,
    });
    if (!user) return next({ message: "User not found", statusCode: 404 });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        id: user._id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        governorate: user.governorate,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { error, value } = changePasswordSchema.validate(req.body, {
      stripUnknown: true,
    });
    if (error) {
      return next({ message: error.details[0].message, statusCode: 400 });
    }

    const user = await User.findById(req.user.id).select("+password");
    if (!user.password) {
      return next({
        message: "This account uses Google sign-in and has no password",
        statusCode: 400,
      });
    }
    if (!user) return next({ message: "User not found", statusCode: 404 });

    const match = await bcrypt.compare(value.current_password, user.password);
    if (!match) {
      return next({
        message: "Current password is incorrect",
        statusCode: 400,
      });
    }

    if (value.current_password === value.new_password) {
      return next({
        message: "New password must be different from the current one",
        statusCode: 400,
      });
    }

    user.password = await bcrypt.hash(value.new_password, 12);
    await user.save();
    user.password = await bcrypt.hash(value.new_password, 12);
    await user.save();

    await BlacklistedToken.create({
      token: req.token,
      expiresAt: new Date(req.user.exp * 1000),
    });

    res.status(200).json({
      success: true,
      message: "Password changed successfully. Please log in again.",
    });

    res
      .status(200)
      .json({ success: true, message: "Password changed successfully" });
  } catch (err) {
    next(err);
  }
};
