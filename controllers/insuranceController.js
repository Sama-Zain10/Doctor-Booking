import Insurance from "../models/insurance.js";

export const addInsurance = async (req, res, next) => {
  try {
    const { insurance_company, policy_holder_name, card_number, expiry_date, card_image } = req.body;

    if (!insurance_company || !policy_holder_name || !card_number || !expiry_date) {
      return next({
        message: "Please provide all required fields",
        statusCode: 400,
      });
    }

    const insurance = await Insurance.create({
      patient_id: req.user.id,
      insurance_company,
      policy_holder_name,
      card_number,
      expiry_date,
      card_image,
    });

    res.status(201).json({
      success: true,
      message: "Insurance added successfully",
      data: insurance,
    });
  } catch (err) {
    next(err);
  }
};

export const getInsurance = async (req, res, next) => {
  try {
    const insurance = await Insurance.findOne({ patient_id: req.user.id });

    if (!insurance) {
      return next({
        message: "No insurance record found for this patient",
        statusCode: 404,
      });
    }

    res.status(200).json({
      success: true,
      data: insurance,
    });
  } catch (err) {
    next(err);
  }
};
