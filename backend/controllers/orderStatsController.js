import orderModel from '../modals/orderModal.js';
import mongoose from 'mongoose';

export const getDailyOrderStats = async (req, res) => {
  try {
    const stats = await orderModel.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$total" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const result = stats.map(stat => ({
      date: stat._id,
      totalOrders: stat.totalOrders,
      totalRevenue: stat.totalRevenue
    }));

    res.json(result);
  } catch (err) {
    console.error('Lỗi thống kê đơn hàng theo ngày:', err);
    res.status(500).json({ message: 'Thống kê thất bại' });
  }
};
export const getOrderStatsByRange = async (req, res) => {
  const { range = 'day' } = req.query;

  let groupId;
  let dateFormat;

  switch (range) {
    case 'week':
      groupId = {
        year: { $year: '$createdAt' },
        week: { $isoWeek: '$createdAt' },
      };
      dateFormat = '%Y-W%V';
      break;
    case 'month':
      groupId = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
      };
      dateFormat = '%Y-%m';
      break;
    case 'year':
      groupId = {
        year: { $year: '$createdAt' },
      };
      dateFormat = '%Y';
      break;
    case 'day':
    default:
      groupId = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        day: { $dayOfMonth: '$createdAt' },
      };
      dateFormat = '%Y-%m-%d';
      break;
  }

  try {
    const stats = await orderModel.aggregate([
      {
        $group: {
          _id: groupId,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$total' },
          createdAt: { $first: '$createdAt' }
        }
      },
      {
        $addFields: {
          date: {
            $dateToString: { format: dateFormat, date: '$createdAt' }
          }
        }
      },
      { $sort: { date: 1 } }
    ]);

    const result = stats.map((item) => ({
      date: item.date,
      totalOrders: item.totalOrders,
      totalRevenue: item.totalRevenue
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Thống kê thất bại', details: err.message });
  }
};
