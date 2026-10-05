import express from 'express';
import {
  createOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All order routes require authentication

router.route('/')
  .post(createOrder)
  .get(admin, getAllOrders);

router.get('/myorders', getMyOrders);

router.route('/:id')
  .get(getOrderById);

router.route('/:id/status')
  .put(admin, updateOrderStatus);

export default router;
