import Item from "../modals/itemModal.js"; // Đổi tên rõ ràng hơn
import { v2 as cloudinary } from "cloudinary";

// CREATE ITEM
export const createItem = async (req, res, next) => {
  try {
    const { name, description, category, price, rating = 0, hearts = 0 } = req.body;
    let imageUrl = "";

    // Upload ảnh lên Cloudinary nếu có
    if (req.file?.path) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "foodie_items",
      });
      imageUrl = result.secure_url;
    }

    const total = Number(price) || 0;

    const newItem = new Item({
      name,
      description,
      category,
      price: Number(price),
      rating: Number(rating),
      hearts: Number(hearts),
      imageUrl,
      total,
    });

    const saved = await newItem.save();
    return res.status(201).json(saved);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Item name already exists" });
    }
    console.error("CREATE ITEM ERROR:", err);
    next(err);
  }
};

// GET ALL ITEMS
export const getItems = async (req, res, next) => {
  try {
    const search = req.query.search || ""; // Thêm search nếu cần lọc
    const query = search
      ? { name: { $regex: search, $options: "i" } }
      : {};

    const items = await Item.find(query).sort({ createdAt: -1 });

    const withFullUrl = items.map((i) => ({
      ...i.toObject(),
      imageUrl: i.imageUrl || "",
    }));

    return res.json(withFullUrl);
  } catch (err) {
    console.error("GET ITEMS ERROR:", err);
    next(err);
  }
};

// DELETE ITEM
export const deleteItem = async (req, res, next) => {
  try {
    const removed = await Item.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: "Item not found" });
    return res.status(200).json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error("DELETE ITEM ERROR:", err);
    next(err);
  }
};

// UPDATE ITEM
export const updateItem = async (req, res, next) => {
  try {
    const { name, description, category, price, rating = 0, hearts = 0 } = req.body;
    const updateData = {
      name,
      description,
      category,
      price: Number(price),
      rating: Number(rating),
      hearts: Number(hearts),
      total: Number(price) || 0,
    };

    if (req.file?.path) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "foodie_items",
      });
      updateData.imageUrl = result.secure_url;
    }

    const updated = await Item.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ message: "Item not found" });

    return res.json({
      ...updated.toObject(),
      imageUrl: updated.imageUrl || "",
    });
  } catch (err) {
    console.error("UPDATE ITEM ERROR:", err);
    next(err);
  }
};
