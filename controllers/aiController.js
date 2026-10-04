import axios from 'axios';
import Patient from '../models/patient.js';
const aiUrl = process.env.AI_SERVICE_URL 
export const chatWithAI = async (req, res, next) => {
    try {
        const { message } = req.body;
        
        const patientId = req.user?.id || req.body.patientId; 

        if (!patientId) {
            console.log(" Error: No Patient ID found in request");
            return res.status(400).json({ success: false, message: "User not authenticated" });
        }

        const patient = await Patient.findById(patientId);
        

        const contextForAI = `Patient Symptoms: ${message}`;

        console.log(" Sending to Python:", contextForAI);

        const aiResponse = await axios.post(`${aiUrl}/classify`, {
    text: contextForAI
});

        console.log(" Python responded:", aiResponse.data);

        res.status(200).json({
            success: true,
            ...aiResponse.data
        });

    } catch (error) {
        console.log("THE REAL ERROR IS:", error.code || "UNKNOWN", error.message);
        
        next({
            message: "AI Classification Service is temporarily unavailable",
            statusCode: 503,
            originalError: error.message
        });
    }
};