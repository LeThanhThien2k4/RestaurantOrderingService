// src/components/admin/OrderChart.jsx
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

const OrderChart = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchStats = async () => {
      const res = await axios.get('http://localhost:4000/api/orders/stats/monthly')
      setData(res.data)
    }
    fetchStats()
  }, [])

  return (
    <div className="bg-[#1e1e1e] p-4 rounded-xl shadow-lg text-white mt-4">
      <h3 className="text-lg font-semibold mb-4 text-amber-400">Biểu đồ đơn hàng theo tháng</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip />
          <Line type="monotone" dataKey="totalOrders" stroke="#f59e0b" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default OrderChart
