import cron from 'node-cron';
import Patient from './models/patient.js';
import { sendEmail } from './utils/SendEmail.js';






    //  reminder for today's scheduled appointments

cron.schedule('00 07 * * *', async () => {
  try {
    console.log("Starting 7:00 AM Reminder Service...");
    const today = new Date().toISOString().split('T')[0];
console.log("System Date is:", today); // See if this matches "2026-05-09"

const appointmentsnumber = await Appoint.find({ 
  date: today, 
  status: "Scheduled" 
});
console.log("Appointments found in DB:", appointmentsnumber.length);
    

    const appointments = await Appoint.find({ 
      date: today, 
      status: "Scheduled" 
    }).populate('patientId').populate('doctorId');

    for (const app of appointments) {
      const patientEmail = app.patientId.email;
      const patientName = app.patientId.name;
      const drName = app.doctorId.name;
      const drSpecialty = app.doctorId.specialty;
      const appTime = app.time;

      const emailSubject = "Today's Appointment Reminder";
      const htmlBody = `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd;">
          <h2 style="color: #2c3e50;">Hello ${patientName},</h2>
          <p>This is a reminder that you have an appointment <b>today</b>.</p>
          <hr>
          <p><b>Doctor:</b> Dr. ${drName}</p>
          <p><b>Specialty:</b> ${drSpecialty}</p>
          <p><b>Time:</b> ${appTime}</p>
          <hr>
          <p>Please arrive 10 minutes early. See you there!</p>
        </div>
      `;

      await sendEmail(patientEmail, emailSubject, htmlBody);
    }

    console.log(`Sent ${appointments.length} reminders.`);
  } catch (error) {
    console.error("Reminder Cron Error:", error);
  }
});







