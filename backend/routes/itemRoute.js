import express from 'express';
import multer from 'multer';
import { createItem, getItems, deleteItem, updateItem } from '../controllers/itemController.js';

const itemRouter = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, 'uploads/'),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

// Routes
itemRouter.route('/')
  .post(upload.single('image'), createItem)
  .get(getItems);

itemRouter.route('/:id')
  .put(upload.single('image'), updateItem)
  .delete(deleteItem);

export default itemRouter;
