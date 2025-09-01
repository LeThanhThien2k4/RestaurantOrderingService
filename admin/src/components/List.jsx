import React, { useEffect, useState } from 'react';
import { styles } from '../assets/dummyadmin';
import { FiHeart, FiStar, FiTrash2, FiTool } from 'react-icons/fi';
import axios from 'axios';
import EditItemModal from './EditItemModal';

const List = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('All');
  const [editItem, setEditItem] = useState(null);

  const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Mexican', 'Italian', 'Desserts', 'Drinks'];

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data } = await axios.get('http://localhost:4000/api/items');
        setItems(data);
      } catch (err) {
        console.error('Error fetching Items:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await axios.delete(`http://localhost:4000/api/items/${itemId}`);
      setItems(prev => prev.filter(item => item._id !== itemId));
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  const handleUpdateItem = (updatedItem) => {
    setItems(prev => prev.map(i => (i._id === updatedItem._id ? updatedItem : i)));
  };

  const renderStars = (rating) =>
    [...Array(5)].map((_, i) => (
      <FiStar
        className={`text-xl ${i < rating ? 'text-amber-400 fill-current' : 'text-amber-100/30'}`}
        key={i}
      />
    ));

  const filteredItems =
    filterCategory === 'All'
      ? items
      : items.filter(item => item.category.toLowerCase() === filterCategory.toLowerCase());

  if (loading) {
    return (
      <div className={styles.pageWrapper.replace(/bg-gradient-to-br.*/, '').concat(' flex items-center justify-center text-amber-100')}>
        Tải Thực Đơn...
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className='max-w-7xl mx-auto'>
        <div className={styles.cardContainer}>
          <div className='flex justify-between items-center mb-4'>
            <h2 className={styles.title}>Manage Menu Items</h2>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold shadow-md outline-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat} className="text-black">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead className={styles.thead}>
                <tr>
                  <th className={styles.th}>Image</th>
                  <th className={styles.th}>Name</th>
                  <th className={styles.th}>Category</th>
                  <th className={styles.th}>Price ($)</th>
                  <th className={styles.th}>Rating</th>
                  <th className={styles.th}>Hearts</th>
                  <th className={styles.thCenter}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredItems.map(item => (
                  <tr key={item._id} className={styles.tr}>
                    <td className={styles.imgCell}>
                      <img src={item.imageUrl} alt={item.name} className={styles.img} />
                    </td>
                    <td className={styles.nameCell}>
                      <div className='space-y-1'>
                        <p className={styles.nameText}>{item.name}</p>
                        <p className={styles.descText}>{item.description}</p>
                      </div>
                    </td>
                    <td className={styles.categoryCell}>{item.category}</td>
                    <td className={styles.priceCell}>${item.price}</td>
                    <td className={styles.ratingCell}>
                      <div className='flex gap-1'>{renderStars(item.rating)}</div>
                    </td>
                    <td className={styles.heartsCell}>
                      <div className={styles.heartsWrapper}>
                        <FiHeart className='text-xl' />
                        <span>{item.hearts}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => setEditItem(item)}
                        className="px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-md hover:opacity-90"
                      >
                        <FiTool className="text-xl" />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="px-3 py-2 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md hover:opacity-90"
                      >
                        <FiTrash2 className="text-xl" />
                      </button>
                    </div>
                  </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredItems.length === 0 && (
            <div className={styles.emptyState}>
              Không tìm thấy món nào thuộc loại "{filterCategory}"
            </div>
          )}
        </div>
      </div>

      {/* Modal luôn nhận boolean */}
      <EditItemModal
        isOpen={!!editItem}
        item={editItem}
        onClose={() => setEditItem(null)}
        onSave={handleUpdateItem}
      />
    </div>
  );
};

export default List;
