import itemModel from '../modals/itemModal.js';
import orderModel from '../modals/orderModal.js';
import userModel from '../modals/userModal.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalItems = await itemModel.countDocuments();
    const totalOrders = await orderModel.countDocuments();
    const totalUsers = await userModel.countDocuments();
    const orders = await orderModel.find();
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

    res.json({
      totalItems,
      totalOrders,
      totalUsers,
      totalRevenue,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};
