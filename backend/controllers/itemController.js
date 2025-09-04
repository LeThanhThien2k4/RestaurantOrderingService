import itemModal from "../modals/itemModal.js";
import { v2 as cloudinary } from "cloudinary";

// CREATE ITEM
export const createItem = async (req, res, next) => {
  try {
    const { name, description, category, price, rating, hearts } = req.body;
    let imageUrl = "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "foodie_items", // Tạo folder riêng trên Cloudinary
      });
      imageUrl = result.secure_url;
    }

    const total = Number(price) * 1;

    const newItem = new itemModal({
      name,
      description,
      category,
      price,
      rating,
      hearts,
      imageUrl, // Link từ Cloudinary
      total,
    });

    const saved = await newItem.save();
    res.status(201).json(saved);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ message: "Item name already exists" });
    } else {
      next(err);
    }
  }
};

// GET ALL ITEMS
export const getItems = async (_req, res, next) => {
  try {
    const items = await itemModal.find().sort({ createdAt: -1 });

    // Với Cloudinary thì imageUrl đã là full link
    const withFullUrl = items.map((i) => ({
      ...i.toObject(),
      imageUrl: i.imageUrl || "",
    }));

    res.json(withFullUrl);
  } catch (err) {
    next(err);
  }
};

// DELETE ITEM
export const deleteItem = async (req, res, next) => {
  try {
    const removed = await itemModal.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: "Item not found" });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

// UPDATE ITEM
export const updateItem = async (req, res, next) => {
  try {
    const { name, description, category, price, rating, hearts } = req.body;
    const updateData = {
      name,
      description,
      category,
      price,
      rating,
      hearts,
      total: Number(price) * 1,
    };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "foodie_items",
      });
      updateData.imageUrl = result.secure_url;
    }

    const updated = await itemModal.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updated) return res.status(404).json({ message: "Item not found" });

    const updatedItem = {
      ...updated.toObject(),
      imageUrl: updated.imageUrl || "",
    };

    res.json(updatedItem);
  } catch (err) {
    next(err);
  }
};
