import express from 'express'
import { confirmPayment, createOrder, getAllOrders, getOrderById, getOrders, updateAnyOrder, updateOrder } from '../controllers/orderController.js'
import authMiddleware from '../middleware/auth.js'
import Order from '../modals/orderModal.js'; // ⬅️ Đảm bảo đã import


  import { getDailyOrderStats } from '../controllers/orderStatsController.js';

  import { getOrderStatsByRange } from '../controllers/orderStatsController.js';


const orderRouter = express.Router()

orderRouter.get('/getall', getAllOrders)
orderRouter.put('/getall/:id', updateAnyOrder)

orderRouter.get('/stats/daily', getDailyOrderStats);
orderRouter.get('/stats/range', getOrderStatsByRange);



// DELETE ORDER BY ID (Admin)
orderRouter.delete('/getall/:id', async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    res.json({ message: 'Đã xoá đơn hàng', id: req.params.id });
  } catch (error) {
    console.error('Delete Order Error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// PROTECT REST OF ROUTES USING MIDDLEWARE
orderRouter.use(authMiddleware)

orderRouter.post('/', createOrder);
orderRouter.get('/', getOrders);
orderRouter.get('/confirm', confirmPayment);
orderRouter.get('/:id', getOrderById);
orderRouter.put('/:id', updateOrder);




export default orderRouter
