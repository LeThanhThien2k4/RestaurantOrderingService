# Foodie

Foodie là một ứng dụng quản lý đặt món ăn trực tuyến, được xây dựng bằng **React (frontend)** và **Node.js + Express (backend)**, sử dụng **MongoDB** làm cơ sở dữ liệu.  

Ứng dụng cho phép người dùng xem menu, đặt món, và quản lý đơn hàng.  

## Demo Local

Bạn có thể chạy project trên máy local để trải nghiệm.

## Yêu cầu

- Node.js >= 16  
- npm hoặc yarn  
- MongoDB (hoặc MongoDB Atlas)  
- Tài khoản Cloudinary (nếu có upload ảnh)  
- Stripe API key (nếu có thanh toán)

## Cài đặt

1. Clone repository:

```bash
git clone https://github.com/username/foodie.git
cd foodie

2. Cài đặt dependencies:
```bash
npm install

3. Tạo file .env :

4. Mở file .env và điền các thông tin cần thiết:
FRONTEND_URL='http://localhost:5173'
GEMINI_API_KEY=your_API_KEY
MONGO_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_KEY=your_stripe_key
JWT_SECRET = "secret"

5. Chạy project:

Frontend:
cd frontend
npm run dev

Backend:
cd backend
npm run start

6. Mở trình duyệt:

Frontend: http://localhost:5173/

Backend: http://localhost:4000/

Cấu trúc thư mục

/frontend : mã nguồn React

/backend : mã nguồn Node.js/Express

/src : components, pages, utils, assets

Liên hệ

Nếu gặp vấn đề khi chạy project, vui lòng liên hệ: thienlethanh2210@gmail.com
