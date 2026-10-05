import express from 'express';
import { getAdminAnalytics } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/analytics', protect, admin, getAdminAnalytics);

export default router;
