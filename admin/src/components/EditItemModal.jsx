import React, { useEffect, useState } from 'react';
import { FiUpload, FiStar, FiHeart } from 'react-icons/fi';
import { FaDollarSign, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { styles } from '../assets/dummyadmin';

const EditItemModal = ({
  isOpen = false,
  onClose = () => {},
  item = {},
  onSave = () => {}
}) => {
  const [formData, setFormData] = useState({
    name: '', description: '', category: '', price: '', rating: 0, hearts: 0, image: null, preview: ''
  });
  const [categories] = useState(['Breakfast', 'Lunch', 'Dinner', 'Mexican', 'Italian', 'Desserts', 'Drinks']);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        description: item.description || '',
        category: item.category || '',
        price: item.price || '',
        rating: item.rating || 0,
        hearts: item.hearts || 0,
        image: null,
        preview: item.imageUrl || ''
      });
    }
  }, [item, isOpen]);

  const handleChange = e => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImage = e => {
    const file = e.target.files[0];
    if (file) setFormData(prev => ({ ...prev, image: file, preview: URL.createObjectURL(file) }));
  };

  const handleRating = rating => setFormData(prev => ({ ...prev, rating }));
  const handleHearts = () => setFormData(prev => ({ ...prev, hearts: prev.hearts + 1 }));

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const payload = new FormData();
      if (formData.image) payload.append('image', formData.image);
      payload.append('name', formData.name);
      payload.append('description', formData.description);
      payload.append('category', formData.category);
      payload.append('price', formData.price);
      payload.append('rating', formData.rating);
      payload.append('hearts', formData.hearts);

      const res = await axios.put(`http://localhost:4000/api/items/${item._id}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onSave(res.data);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="fixed inset-0 flex items-start justify-center py-8 px-4">
        <div className="relative w-full max-w-3xl bg-[#2D1B0E] rounded-2xl shadow-2xl">
          {/* Scrollable Content */}
          <div className="relative p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-amber-400 hover:text-amber-600 text-xl"
            >
              <FaTimes />
            </button>
            <h2 className="text-2xl font-bold text-amber-400 mb-6 text-center">Edit Menu Item</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Upload */}
              <div className={styles.uploadWrapper}>
                <label className={styles.uploadLabel}>
                  {formData.preview ? (
                    <img src={formData.preview} alt="Preview" className={styles.previewImage} />
                  ) : (
                    <div className="text-center p-4">
                      <FiUpload className={styles.uploadIcon} />
                      <p className={styles.uploadText}>Click để tải hình ảnh</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
                </label>
              </div>

              {/* Name */}
              <div>
                <label className="block mb-2 text-amber-400">Tên sản phẩm</label>
                <input
                  type="text" name="name" value={formData.name} onChange={handleChange}
                  className={styles.inputField} required
                />
              </div>

              {/* Desc */}
              <div>
                <label className="block mb-2 text-amber-400">Mô tả</label>
                <textarea
                  name="description" value={formData.description} onChange={handleChange}
                  className={`${styles.inputField} h-32`} required
                />
              </div>

              {/* Category & Price */}
              <div className={styles.gridTwoCols}>
                <div>
                  <label className="block mb-2 text-amber-400">Loại</label>
                  <select name="category" value={formData.category} onChange={handleChange} className={styles.inputField} required>
                    <option value="">Chọn loại hàng</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-amber-400">Giá</label>
                  <div className="relative">
                    <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 text-lg" />
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className={`${styles.inputField} pl-10 sm:pl-12`}
                        required
                    />
                    </div>

                </div>
              </div>

              {/* Rating & Hearts */}
              <div className={styles.gridTwoCols}>
                <div>
                  <label className="block mb-2 text-amber-400">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star} type="button"
                        onClick={() => handleRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="text-2xl"
                      >
                        <FiStar className={star <= (hoverRating || formData.rating) ? 'text-amber-400 fill-current' : 'text-amber-100/30'} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-amber-400">Phổ Biến</label>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={handleHearts} className="text-2xl text-amber-400 hover:text-amber-300">
                      <FiHeart />
                    </button>
                    <input
                      type="number" name="hearts" value={formData.hearts} onChange={handleChange}
                      className={styles.inputField} required
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-between gap-4">
                <button
                  type="button" onClick={onClose}
                  className="w-full py-3 bg-gradient-to-r from-red-600 to-red-800 text-white font-bold rounded-lg hover:scale-105 transition-transform"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-[#2D1B0E] font-bold rounded-lg hover:scale-105 transition-transform"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditItemModal;
