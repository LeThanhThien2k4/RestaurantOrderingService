// frontend/src/utils/image.js

/**
 * Chuẩn hoá đường dẫn ảnh để toàn bộ frontend dùng thống nhất
 * - Nếu là link Cloudinary (http/https) → trả về nguyên gốc
 * - Nếu là đường dẫn local (/uploads/...) → ghép baseURL backend
 * - Nếu không có ảnh → trả fallback mặc định
 */

export const buildImageUrl = (url) => {
  if (!url) {
    // fallback nếu không có ảnh
    return "https://via.placeholder.com/300x300?text=No+Image";
  }

  // Nếu là Cloudinary hoặc bất kỳ URL đầy đủ nào
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // Trường hợp dữ liệu cũ vẫn lưu local (/uploads/..)
  return `http://localhost:4000${url}`;
};
