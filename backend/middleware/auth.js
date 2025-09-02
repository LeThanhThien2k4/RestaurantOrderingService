import jwt from 'jsonwebtoken';
import userModel from '../modals/userModal.js'; // Đảm bảo đường dẫn đúng

// Middleware xác thực token
const authMiddleware = async (req, res, next) => {
  try {
    // Lấy token từ cookie hoặc header Authorization
    const token =
      req.cookies?.token ||
      (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if (!token) {
      return res.status(401).json({ success: false, message: 'Token Missing' });
    }

    // Giải mã token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Lấy thông tin user từ DB
    const user = await userModel.findById(decoded.id).select('email role');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.user = { _id: user._id, email: user.email, role: user.role };
    next();
  } catch (err) {
    console.error(err);
    const message =
      err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid Token';
    res.status(403).json({ success: false, message });
  }
};

// Middleware kiểm tra quyền Admin
export const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access only' });
  }
  next();
};

// Middleware kiểm tra quyền Staff/Admin
export const isStaffOrAdmin = (req, res, next) => {
  if (!['staff', 'admin'].includes(req.user?.role)) {
    return res.status(403).json({ success: false, message: 'Staff/Admin access only' });
  }
  next();
};

export default authMiddleware;
