import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// @desc    Get Admin Dashboard Analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
export const getAdminAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Calculate total revenue and average order value
    const revenueAgg = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
          avgOrderValue: { $avg: '$totalPrice' }
        }
      }
    ]);

    const totalRevenue = revenueAgg.length > 0 ? Number(revenueAgg[0].totalRevenue.toFixed(2)) : 0;
    const avgOrderValue = revenueAgg.length > 0 ? Number(revenueAgg[0].avgOrderValue.toFixed(2)) : 0;

    // Order status breakdown
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    // Low stock products alert (<= 5 items left)
    const lowStockProducts = await Product.find({ stock: { $lte: 5 } })
      .select('name stock category price')
      .limit(10);

    // Recent orders (last 6)
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(6);

    // Sales by category aggregation
    const salesByCategory = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $unwind: '$orderItems' },
      {
        $lookup: {
          from: 'products',
          localField: 'orderItems.product',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      { $unwind: '$productDetails' },
      {
        $group: {
          _id: '$productDetails.category',
          totalSales: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } },
          unitsSold: { $sum: '$orderItems.quantity' }
        }
      },
      { $sort: { totalSales: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        summary: {
          totalUsers,
          totalProducts,
          totalOrders,
          totalRevenue,
          avgOrderValue
        },
        ordersByStatus,
        lowStockProducts,
        recentOrders,
        salesByCategory
      }
    });
  } catch (error) {
    next(error);
  }
};
