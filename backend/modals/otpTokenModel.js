import mongoose from 'mongoose';

const otpTokenSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, index: true },
    otp: { type: String, required: true },        // lưu dạng string 6 chữ số
    expiresAt: { type: Date, required: true },     // thời hạn OTP (vd: 10 phút)
    used: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Xoá tự động sau khi hết hạn (TTL index)
otpTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OtpToken = mongoose.model('OtpToken', otpTokenSchema);
export default OtpToken;
