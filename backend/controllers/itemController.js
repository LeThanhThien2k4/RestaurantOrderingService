import itemModal from "../modals/itemModal.js";

// CREATE ITEM
export const createItem = async (req, res, next) => {
  try {
    const { name, description, category, price, rating, hearts } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
    const total = Number(price) * 1;

    const newItem = new itemModal({
      name,
      description,
      category,
      price,
      rating,
      hearts,
      imageUrl,
      total
    });

    const saved = await newItem.save();
    res.status(201).json(saved);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ message: 'Item name already exists' });
    } else {
      next(err);
    }
  }
};

// GET ALL ITEMS
export const getItems = async (_req, res, next) => {
  try {
    const items = await itemModal.find().sort({ createdAt: -1 });
    const host = `${_req.protocol}://${_req.get('host')}`;

    const withFullUrl = items.map(i => ({
      ...i.toObject(),
      imageUrl: i.imageUrl ? host + i.imageUrl : '',
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
      total: Number(price) * 1
    };

    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updated = await itemModal.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    if (!updated) return res.status(404).json({ message: "Item not found" });

    const host = `${req.protocol}://${req.get('host')}`;
    const updatedItem = {
      ...updated.toObject(),
      imageUrl: updated.imageUrl ? host + updated.imageUrl : '',
    };

    res.json(updatedItem);
  } catch (err) {
    next(err);
  }
};
