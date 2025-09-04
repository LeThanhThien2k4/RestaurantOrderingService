// frontend/src/utils/image.js

/**
 * Chuẩn hoá đường dẫn ảnh để toàn bộ frontend dùng thống nhất
 * - Nếu là link Cloudinary (http/https) → trả về nguyên gốc
 * - Nếu là đường dẫn local (/uploads/...) → ghép baseURL backend
 * - Nếu không có ảnh → trả fallback mặc định (placeholder)
 */

const FALLBACK_IMAGE = "https://via.placeholder.com/300x300?text=No+Image";
const BASE_URL = "http://localhost:4000"; // Backend API gốc

export const buildImageUrl = (url) => {
  if (!url) return FALLBACK_IMAGE;

  // Nếu đã là link đầy đủ (Cloudinary hoặc URL khác)
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // Nếu vẫn còn dữ liệu cũ dạng /uploads/xxx
  if (url.startsWith("/")) {
    return `${BASE_URL}${url}`;
  }

  // Trường hợp xấu nhất → fallback
  return FALLBACK_IMAGE;
};
