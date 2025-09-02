// admin/src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styles } from '../assets/dummyadmin';
import { FaUserFriends, FaClipboardList, FaDollarSign, FaHamburger } from 'react-icons/fa';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';

import UserListModal from '../components/UserListModal';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [rangeStats, setRangeStats] = useState([]);
  const [range, setRange] = useState('day');

  // Modal + user list
  const [showUserModal, setShowUserModal] = useState(false);
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/dashboard/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Lỗi lấy dữ liệu dashboard:', err);
      }
    };

    const fetchRangeStats = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/orders/stats/range?range=${range}`);
        setRangeStats(res.data);
      } catch (err) {
        console.error('Lỗi lấy dữ liệu biểu đồ:', err);
      }
    };

    fetchStats();
    fetchRangeStats();
  }, [range]);

  // ✅ Hàm lấy danh sách người dùng (dùng lại cho refresh sau khi đổi role)
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Bạn chưa đăng nhập!");
        return;
      }

      const res = await axios.get("http://localhost:4000/api/user/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserList(res.data.users || []); // đảm bảo là array
    } catch (error) {
      console.error("Lỗi lấy danh sách người dùng:", error);
      alert("Không thể tải danh sách người dùng");
    }
  };

  // ✅ Khi click card Người Dùng
  const handleUserClick = async () => {
    await fetchUsers();
    setShowUserModal(true);
  };

  const Card = ({ icon: Icon, label, value, color, onClick }) => (
    <div
      className='bg-[#3a2b2b] p-6 rounded-xl shadow-lg flex items-center gap-4 text-white cursor-pointer hover:bg-[#4a3b3b]'
      onClick={onClick}
    >
      <div className={`text-4xl ${color}`}>
        <Icon />
      </div>
      <div>
        <h4 className='text-lg'>{label}</h4>
        <p className='text-2xl font-bold'>{value}</p>
      </div>
    </div>
  );

  return (
    <div className={styles.pageWrapper}>
      <div className='max-w-6xl mx-auto space-y-6'>
        <h2 className={styles.title}>Tổng quan Dashboard</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          <Card
            icon={FaHamburger}
            label='Món Ăn'
            value={stats?.totalItems ?? '...'}
            color='text-amber-400'
            onClick={() => navigate('/list')}
          />
          <Card
            icon={FaClipboardList}
            label='Đơn Hàng'
            value={stats?.totalOrders ?? '...'}
            color='text-amber-300'
            onClick={() => navigate('/orders')}
          />
          <Card
            icon={FaUserFriends}
            label='Người Dùng'
            value={stats?.totalUsers ?? '...'}
            color='text-amber-200'
            onClick={handleUserClick} // mở modal
          />
          <Card
            icon={FaDollarSign}
            label='Doanh Thu'
            value={`$${stats?.totalRevenue?.toFixed(2) ?? '...'}`}
            color='text-amber-500'
          />
        </div>

        <div className='bg-[#3a2b2b] p-6 rounded-xl shadow-lg text-white mt-8'>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Biểu đồ đơn hàng & doanh thu theo thời gian</h3>
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="text-black px-3 py-1 rounded-md bg-white"
            >
              <option value="day">Ngày</option>
              <option value="week">Tuần</option>
              <option value="month">Tháng</option>
              <option value="year">Năm</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={rangeStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#888" />
              <XAxis dataKey="date" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="totalOrders" stroke="#fbbf24" name="Đơn Hàng" />
              <Line type="monotone" dataKey="totalRevenue" stroke="#34d399" name="Doanh Thu" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ✅ Modal hiện danh sách người dùng kèm refresh */}
      <UserListModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        users={userList}
        refreshUsers={fetchUsers}
      />
    </div>
  );
};

export default Dashboard;
