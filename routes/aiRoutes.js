import express from 'express';
import axios from 'axios';
import { chatWithAI } from '../controllers/aiController.js';
import {protectP} from "../middleware/auth.js";

const router = express.Router();


router.post('/chat',protectP, chatWithAI);

export default router;