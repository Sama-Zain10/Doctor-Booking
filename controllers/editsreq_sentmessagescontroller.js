import crypto from "node:crypto";
import Doctor from "../models/doctor.js";
import RequestEdits from "../models/sentmessages_reqedit.js";
import sendEmail from "../utils/SendEmail.js";


export const sendEditRequest = async (req, res, next) => {
  try {
    const { doctor_id, title, message } = req.body;

  
    if (
      !doctor_id ||
      typeof title !== "string" ||
      !title.trim() ||
      typeof message !== "string" ||
      !message.trim()
    ) {
      return res.status(400).json({
        message: "Doctor, title and message are required",
      });
    }


    const doctor = await Doctor.findById(doctor_id)
      .populate("user_id", "email full_name");

    if (!doctor || !doctor.user_id?.email) {
      return res.status(404).json({
        message: "Doctor or doctor email not found",
      });
    }

    
    const token = crypto.randomBytes(32).toString("hex");

    
    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    
    const expiresAt = new Date(
      Date.now() + 48 * 60 * 60 * 1000
    );

    // الرابط اللي هيتبعت للدكتور
    const backendUrl = process.env.BACKEND_URL?.replace(/\/+$/, "");

    if (!backendUrl) {
      return res.status(500).json({
        message: "BACKEND_URL is not configured",
      });
    }

    const uploadLink =
      `${backendUrl}/doctor-upload?token=${encodeURIComponent(token)}`;

    // حفظ فجزء المرسلة في الاشعارات للادمن
    const request = await RequestEdits.create({
      doctor_id: doctor._id,
      title: title.trim(),
      message: message.trim(),
      audience: "doctors",
      sent_by: "email",
      email_status: "failed",
      token_hash: tokenHash,
      expires_at: expiresAt,
    });

    try {
      
      await sendEmail({
        to: doctor.user_id.email,
        subject: title.trim(),
        text:
          `${message.trim()}\n\n` +
          `Please upload your updated image using this link:\n` +
          `${uploadLink}\n\n` +
          `The link expires in 48 hours and can be used once.`,
        html: `
          <h2>${escapeHtml(title.trim())}</h2>
          <p>${escapeHtml(message.trim())}</p>
          <p>Please click the link below to upload your updated image:</p>
          <p>
            <a href="${escapeHtml(uploadLink)}">
              Upload Image
            </a>
          </p>
          <p>This link expires in 48 hours and can be used once.</p>
        `,
      });
    } catch (emailError) {
    
      request.token_hash = null;
      request.expires_at = null;
      request.email_status = "failed";
      await request.save();

      console.error("Edit request email failed:", emailError);

      return res.status(502).json({
        message: "Email could not be sent. Doctor status was not changed.",
        email_status: "failed",
      });
    }

    // لو الرسالة وصلت للايميل للدكتور 
    request.email_status = "sent";
    request.date_sent = new Date();
    await request.save();

    // بعد ما الرسالة توصل حساب الدكتور هيبقا حالته محتاج تعديل
    doctor.approval_status = "require_edits";
    await doctor.save();

    return res.status(200).json({
      message: "Edit request sent successfully",
      email_status: "sent",
      request: {
        _id: request._id,
        doctor_id: request.doctor_id,
        title: request.title,
        message: request.message,
        email_status: request.email_status,
        date_sent: request.date_sent,
      },
    });
  } catch (error) {
    next(error);
  }
};

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);
}
