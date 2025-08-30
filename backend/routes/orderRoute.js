import express from 'express'
import {
  confirmPayment,
  createOrder,
  getAllOrders,
  getOrderById,
  getOrders,
  updateAnyOrder,
  updateOrder,
  deleteOrder
} from '../controllers/orderController.js'

import authMiddleware from '../middleware/auth.js'
import Order from '../modals/orderModal.js'
import { getDailyOrderStats, getOrderStatsByRange } from '../controllers/orderStatsController.js'

const orderRouter = express.Router()

// ADMIN ROUTES
orderRouter.get('/getall', getAllOrders)
orderRouter.put('/getall/:id', updateAnyOrder)
orderRouter.delete('/getall/:id', async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' })
    res.json({ message: 'Đã xoá đơn hàng', id: req.params.id })
  } catch (error) {
    console.error('Delete Order Error:', error)
    res.status(500).json({ message: 'Lỗi server', error: error.message })
  }
})

// STATS ROUTES
orderRouter.get('/stats/daily', getDailyOrderStats)
orderRouter.get('/stats/range', getOrderStatsByRange)

// PROTECT REST OF ROUTES USING MIDDLEWARE
orderRouter.use(authMiddleware)

// USER ROUTES
orderRouter.post('/', createOrder)
orderRouter.get('/', getOrders)
orderRouter.get('/confirm', confirmPayment)
orderRouter.get('/:id', getOrderById)
orderRouter.put('/:id', updateOrder)
orderRouter.delete('/:id', deleteOrder)

export default orderRouter
