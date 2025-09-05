import React, { useEffect, useState } from 'react';
import { tableClasses, statusStyles, paymentMethodDetails } from '../assets/dummyadmin';
import { FiUser, FiClock, FiTruck, FiCheckCircle, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';
import { buildImageUrl } from '../utils/image';
const iconMap = {
  FiClock: <FiClock className="text-lg" />,
  FiTruck: <FiTruck className="text-lg" />,
  FiCheckCircle: <FiCheckCircle className="text-lg" />,
};

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/orders/getall', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      const formatted = response.data.map(order => ({
        ...order,
        address: order.address ?? order.shippingAddress?.address ?? '',
        city: order.city ?? order.shippingAddress?.city ?? '',
        zipCode: order.zipCode ?? order.shippingAddress?.zipCode ?? '',
        phone: order.phone ?? '',
        items: order.items?.map(e => ({ _id: e._id, item: e.item, quantity: e.quantity })) || [],
        createdAt: new Date(order.createdAt).toLocaleDateString('en-IN', {
          year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
        }),
      }));

      setOrders(formatted);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Không tải được đơn hàng.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:4000/api/orders/getall/${orderId}`, { status: newStatus });
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      alert(err.response?.data?.message || 'Không cập nhật được đơn hàng');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Bạn có chắc muốn xoá đơn hàng này không?')) return;

    try {
      await axios.delete(`http://localhost:4000/api/orders/getall/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setOrders(prev => prev.filter(order => order._id !== orderId));
    } catch (err) {
      alert(err.response?.data?.message || 'Xoá đơn hàng thất bại');
    }
  };

  if (loading) return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a120b] via-[#2a1e14] to-[#3e2b1d]'>
      <div className='text-amber-400 text-xl'>Đang tải đơn hàng...</div>
    </div>
  );

  if (error) return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a120b] via-[#2a1e14] to-[#3e2b1d]'>
      <div className='text-red-400 text-xl'>{error}</div>
    </div>
  );

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#1a120b] via-[#2a1e14] to-[#3e2b1d] py-12 px-4'>
      <div className='mx-auto max-w-7xl'>
        <div className='bg-[#4b3b3b]/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-2 border-amber-500/20'>
          <h2 className='text-3xl font-bold mb-8 bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent text-center'>Order Management</h2>
          <div className={tableClasses.wrapper}>
            <table className={tableClasses.table}>
              <thead className={tableClasses.headerRow}>
                <tr>
                  {['Order ID', 'Customer', 'Address', 'Items', 'Total Items', 'Price', 'Payment', 'Status', 'Delete'].map(h => (
                    <th key={h} className={`${tableClasses.headerCell} text-center`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(order => {
                  const totalItems = order.items.reduce((s, i) => s + i.quantity, 0);
                  const totalPrice = order.total ?? order.items.reduce((s, i) => s + i.item.price * i.quantity, 0);
                  const payMethod = paymentMethodDetails[order.paymentMethod?.toLowerCase()] || paymentMethodDetails.default;
                  const payStatusStyle = statusStyles[order.paymentStatus] || statusStyles.processing;
                  const stat = statusStyles[order.status] || statusStyles.processing;

                  return (
                    <tr key={order._id} className={tableClasses.row}>
                      <td className={`${tableClasses.cellBase} text-center font-mono text-sm text-amber-100`}>#{order._id?.slice(-8)}</td>
                      <td className={`${tableClasses.cellBase} text-center`}>
                        <div className='flex items-center gap-2 justify-center'>
                          <FiUser className='text-amber-400' />
                          <div>
                            <p className='text-amber-100'>{order.user?.name || order.firstName + ' ' + order.lastName}</p>
                            <p className='text-sm text-amber-400/60'>{order.user?.phone || order.phone}</p>
                            <p className='text-sm text-amber-400/60'>{order.user?.email || order.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className={`${tableClasses.cellBase} text-center`}>
                        <div className='text-amber-100/80 text-sm max-w-[200px]'>
                          {order.address}, {order.city} - {order.zipCode}
                        </div>
                      </td>

                    
                                        <td className="p-4 text-center align-top">
                      <div className="space-y-2 min-w-[180px]">
                        {order.items.map((item, index) => (
                          <div
                            key={`${order._id}-${index}`}
                            className="flex items-center gap-3 p-2 bg-[#3a2b2b]/50 rounded-lg"
                          >
                            <img
                              src={buildImageUrl(item.item.imageUrl || item.item.image)}
                              alt={item.item.name}
                              className="w-10 h-10 object-cover rounded-lg"
                            />
                            <div className="flex-1 text-left break-words">
                              <span className="text-amber-100/80 text-sm block">
                                {item.item.name}
                              </span>
                              <div className="flex items-center gap-2 text-xs text-amber-400/60">
                                <span>{item.item.price}</span>
                                <span className="mx-1">&middot;</span>
                                <span>x{item.quantity}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>


                      <td className='text-center text-amber-300 text-lg'>{totalItems}</td>
                      <td className='text-center text-amber-300 text-lg'>$ {totalPrice.toFixed(2)}</td>
                      <td className={`${tableClasses.cellBase} text-center`}>
                        <div className='flex flex-col gap-2 items-center'>
                          <div className={`${payMethod.class} px-3 py-1.5 rounded-lg border text-sm`}>
                            {payMethod.label}
                          </div>
                          <div className={`${payStatusStyle.color} flex items-center gap-2 text-sm`}>
                            {iconMap[payStatusStyle.icon] || <FiClock className='text-lg' />}
                            <span>{payStatusStyle.label}</span>
                          </div>
                        </div>
                      </td>
                      <td className={`${tableClasses.cellBase} text-center`}>
                        <div className='flex items-center gap-2 justify-center'>
                          <span className={`${stat.color} text-xl`}>{iconMap[stat.icon] || <FiClock className='text-lg' />}</span>
                          <select
                            value={order.status}
                            onChange={e => handleStatusChange(order._id, e.target.value)}
                            className='px-4 py-2 rounded-lg bg-[#3a2b2b]/30 border border-amber-500/20 text-sm text-amber-100 cursor-pointer'>
                            {Object.entries(statusStyles)
                              .filter(([key]) => key !== 'succeeded')
                              .map(([key, sty]) => (
                                <option value={key} key={key} className={`${sty.bg} ${sty.color}`}>
                                  {sty.label}
                                </option>
                              ))}
                          </select>
                        </div>
                      </td>
                      <td className="text-center">
                        <button
                          onClick={() => handleDeleteOrder(order._id)}
                          className="px-3 py-2 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md hover:opacity-90"
                        >
                          <FiTrash2 className="text-xl" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {orders.length === 0 && <div className='text-center py-12 text-amber-100/60 text-xl'>Không tìm thấy đơn hàng nào</div>}
        </div>
      </div>
    </div>
  );
};

export default Order;
