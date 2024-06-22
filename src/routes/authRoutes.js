import express from 'express';
import { googleAuth, googleAuthRedirect } from '../controllers/authController.js';

const router = express.Router();
router.get("/", googleAuth);
router.get("/google/redirect", googleAuthRedirect);

export default router;
