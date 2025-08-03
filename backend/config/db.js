import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose.connect("mongodb+srv://duonghongphucfpt237:Cartein21@cluster0.13hjwlo.mongodb.net/FoodieFrenzy")
  .then(() => console.log('DB CONNECTED'))

}
