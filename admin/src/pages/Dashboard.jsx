// admin/src/pages/Dashboard.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../assets/dummyadmin";
import {
  FaUserFriends,
  FaClipboardList,
  FaDollarSign,
  FaHamburger,
} from "react-icons/fa";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import UserListModal from "../components/UserListModal";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [rangeStats, setRangeStats] = useState([]);
  const [range, setRange] = useState("day");
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingChart, setLoadingChart] = useState(true);

  const [showUserModal, setShowUserModal] = useState(false);
  const [userList, setUserList] = useState([]);

  const lineRefs = useRef({});
  const [hasAnimated, setHasAnimated] = useState(false); // 🔥 Thêm state

  // Load tổng quan stats
  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        const res = await axios.get("http://localhost:4000/api/dashboard/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Lỗi lấy dữ liệu dashboard:", err);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  // Load chart theo range
  const fetchRangeStats = async (range) => {
    setLoadingChart(true);
    try {
      const res = await axios.get(
        `http://localhost:4000/api/orders/stats/range?range=${range}`
      );
      setRangeStats(res.data);
    } catch (err) {
      console.error("Lỗi lấy dữ liệu biểu đồ:", err);
    } finally {
      setLoadingChart(false);
    }
  };

  useEffect(() => {
    fetchRangeStats(range);
  }, [range]);

  // Trigger animation khi rangeStats thay đổi
  useEffect(() => {
    if (hasAnimated) return; // 🔥 Ngăn không cho animate lại khi quay lại
    Object.values(lineRefs.current).forEach((line) => {
      if (line) {
        line.style.transition = "none";
        line.style.strokeDasharray = line.getTotalLength();
        line.style.strokeDashoffset = line.getTotalLength();
        setTimeout(() => {
          line.style.transition = "stroke-dashoffset 1.2s ease-out";
          line.style.strokeDashoffset = "0";
        }, 50);
      }
    });
    setHasAnimated(true); // 🔥 Đánh dấu đã animate xong
  }, [rangeStats, hasAnimated]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Bạn chưa đăng nhập!");
        return;
      }
      const res = await axios.get("http://localhost:4000/api/user/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserList(res.data.users || []);
    } catch (error) {
      console.error("Lỗi lấy danh sách người dùng:", error);
      alert("Không thể tải danh sách người dùng");
    }
  };

  const handleUserClick = async () => {
    await fetchUsers();
    setShowUserModal(true);
  };

  const Card = ({ icon: Icon, label, value, color, onClick }) => (
    <div
      className="bg-gradient-to-br from-[#3a2b2b] to-[#2a1a1a] p-6 rounded-xl shadow-lg flex items-center gap-4 text-white 
                 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
      onClick={onClick}
    >
      <div className={`text-4xl ${color}`}>
        <Icon />
      </div>
      <div>
        <h4 className="text-lg opacity-80">{label}</h4>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );

  return (
    <div className={styles.pageWrapper}>
      <div className="max-w-6xl mx-auto space-y-6">
        <h2 className={styles.title}>Tổng quan Dashboard</h2>

        {loadingStats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-28 bg-[#3a2b2b] rounded-xl animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card
              icon={FaHamburger}
              label="Món Ăn"
              value={stats?.totalItems ?? "..."}
              color="text-amber-400"
              onClick={() => navigate("/list")}
            />
            <Card
              icon={FaClipboardList}
              label="Đơn Hàng"
              value={stats?.totalOrders ?? "..."}
              color="text-amber-300"
              onClick={() => navigate("/orders")}
            />
            <Card
              icon={FaUserFriends}
              label="Người Dùng"
              value={stats?.totalUsers ?? "..."}
              color="text-amber-200"
              onClick={handleUserClick}
            />
            <Card
              icon={FaDollarSign}
              label="Doanh Thu"
              value={`$${stats?.totalRevenue?.toFixed(2) ?? "..."}`}
              color="text-amber-500"
            />
          </div>
        )}

        {/* Chart */}
        <div className="bg-gradient-to-br from-[#3a2b2b] to-[#2a1a1a] p-6 rounded-xl shadow-lg text-white mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">
              Biểu đồ đơn hàng & doanh thu theo thời gian
            </h3>
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="text-black px-3 py-1 rounded-md bg-white border border-gray-300 hover:border-amber-400 transition"
            >
              <option value="day">Ngày</option>
              <option value="week">Tuần</option>
              <option value="month">Tháng</option>
              <option value="year">Năm</option>
            </select>
          </div>

          {loadingChart ? (
            <div className="h-72 bg-[#3a2b2b] animate-pulse rounded-xl"></div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={rangeStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#666" />
                <XAxis dataKey="date" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#2a1a1a", color: "#fff" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="totalOrders"
                  stroke="#fbbf24"
                  name="Đơn Hàng"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  ref={(el) => (lineRefs.current["orders"] = el?.node)}
                />
                <Line
                  type="monotone"
                  dataKey="totalRevenue"
                  stroke="#34d399"
                  name="Doanh Thu"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  ref={(el) => (lineRefs.current["revenue"] = el?.node)}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

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
