import React, { useEffect, useState } from 'react';
import { useCart } from '../../CartContext/CartContext';
import axios from 'axios';
import { FaPlus, FaMinus, FaStar, FaSearch } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import './OurMenu.css';
import { buildImageUrl } from "../../utils/image";

const categories = ['Tất cả', 'Breakfast', 'Lunch', 'Dinner', 'Mexican', 'Italian', 'Desserts', 'Drinks'];

const OurMenu = () => {
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const { cartItems, addToCart, removeFromCart, updateQuantity } = useCart();
  const [menuData, setMenuData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]); 
  const [ratingFilter, setRatingFilter] = useState(0);
  const [sortBy, setSortBy] = useState('newest');
  const location = useLocation();

  // 🔥 Đồng bộ search từ URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('search') || '';
    setSearchQuery(q);
  }, [location.search]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/items');
        setMenuData(res.data);
      } catch (err) {
        console.error('Failed to load menu items:', err);
      }
    };
    fetchMenu();
  }, []);

  const getCartEntry = id => cartItems.find(ci => ci.item._id === id);
  const getQuantity = id => getCartEntry(id)?.quantity || 0;

  // 🔥 Lọc sản phẩm
  const filterItems = (items) =>
    items.filter(item => {
      const price = Number(item.price);
      const meetsPrice = price >= priceRange[0] && price <= priceRange[1];
      const meetsRating = !ratingFilter || item.rating >= ratingFilter;
      const meetsCategory =
        selectedCategory === 'Tất cả' || item.category === selectedCategory;
      const meetsSearch =
        !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return meetsPrice && meetsRating && meetsCategory && meetsSearch;
    });

  let displayItems = filterItems(menuData);

  // 🔥 Sort sản phẩm
  if (sortBy === 'newest') {
    displayItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sortBy === 'popular') {
    displayItems.sort((a, b) => (b.likes || 0) - (a.likes || 0));
  } else if (sortBy === 'priceLow') {
    displayItems.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'priceHigh') {
    displayItems.sort((a, b) => b.price - a.price);
  }

  return (
    <div className="bg-gradient-to-br from-[#1a120b] via-[#2a1e14] to-[#3e2b1d] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200">
          <span className="font-dancingscript block text-5xl md:text-7xl sm:text-6xl mb-2">
            Thực Đơn Tuyệt Vời
          </span>
          <span className="block text-xl sm:text-2xl md:text-3xl font-cinzel mt-4 text-amber-100/80">
            Hương Vị Bùng Nổ
          </span>
        </h2>

        {/* 🔥 Bộ lọc ngang */}
        <div className="bg-amber-900/30 backdrop-blur-md border border-amber-800/40 rounded-2xl p-4 mb-8 flex flex-wrap gap-6 items-center justify-between shadow-lg shadow-black/30">
          
          {/* Dropdown loại món */}
          <div className="flex flex-col text-amber-100">
            <label className="mb-1 text-sm font-semibold tracking-wide text-amber-200">
              Loại món:
            </label>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none w-full bg-gradient-to-r from-amber-900/80 to-amber-800/70
             border border-amber-600/40 rounded-xl px-4 pr-10 py-2 text-sm text-white 
             shadow-lg shadow-black/20 focus:outline-none focus:ring-2 focus:ring-amber-400/60 
             transition-all duration-300 cursor-pointer leading-6 custom-select"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#2a1e14] text-amber-100">
                    {cat}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-300 pointer-events-none"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* 🔥 Sort */}
          <div className="flex flex-col text-amber-100">
            <label className="mb-1 text-sm font-semibold tracking-wide text-amber-200">
              Sắp xếp:
            </label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none w-full bg-gradient-to-r from-amber-900/80 to-amber-800/70
             border border-amber-600/40 rounded-xl px-4 pr-10 py-2 text-sm text-white 
             shadow-lg shadow-black/20 focus:outline-none focus:ring-2 focus:ring-amber-400/60 
             transition-all duration-300 cursor-pointer leading-6 custom-select"
              >
                <option value="newest">Mới nhất</option>
                <option value="popular">Phổ biến nhất</option>
                <option value="priceLow">Giá: Thấp → Cao</option>
                <option value="priceHigh">Giá: Cao → Thấp</option>
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-300 pointer-events-none"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Thanh trượt giá */}
          <div className="flex flex-col text-amber-100">
            <label className="mb-1 text-sm">Giá: {priceRange[0]} - {priceRange[1]} VND</label>
            <input
              type="range"
              min="0"
              max="1000"
              step="10"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, Number(e.target.value)])}
              className="w-40 accent-amber-500"
            />
          </div>

          {/* Rating */}
          <div className="flex flex-col text-amber-100">
            <label className="mb-1 text-sm">Đánh giá:</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setRatingFilter(star === ratingFilter ? 0 : star)}
                  className={`text-lg ${ratingFilter >= star ? 'text-amber-400' : 'text-amber-600/50'}`}
                >
                  <FaStar />
                </button>
              ))}
            </div>
          </div>

          {/* 🔍 Search */}
          <div className="flex flex-col text-amber-100">
            <label className="mb-1 text-sm">Tìm kiếm:</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nhập tên món..."
                className="bg-gradient-to-r from-amber-900/80 to-amber-800/70 border border-amber-600/40 
                rounded-xl px-4 py-2 text-sm text-white shadow-lg shadow-black/20 
                focus:outline-none focus:ring-2 focus:ring-amber-400/60 transition-all duration-300"
              />
              <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-300" />
            </div>
          </div>

          {/* Reset */}
          <button
            onClick={() => { 
              setPriceRange([0, 1000]); 
              setRatingFilter(0); 
              setSelectedCategory('Tất cả'); 
              setSortBy('newest');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-white text-sm font-semibold hover:scale-105 transition"
          >
            Reset Lọc
          </button>
        </div>

        {/* Danh sách món */}
        {displayItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
            {displayItems.map((item, i) => {
              const cartEntry = getCartEntry(item._id);
              const quantity = cartEntry?.quantity || 0;

              return (
                <div
                  key={item._id}
                  className="relative bg-amber-900/20 rounded-2xl overflow-hidden border border-amber-800/30 backdrop-blur-sm flex flex-col transition-all duration-500"
                  style={{ '--index': i }}
                >
                  <div className="relative h-48 sm:h-56 md:h-60 flex items-center justify-center bg-black/10">
                    <img 
                      src={buildImageUrl(item.imageUrl || item.image)}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain transition-all duration-700" 
                    />
                  </div>

                  <div className="p-4 sm:p-6 flex flex-col flex-grow">
                    <h3 className="text-xl sm:text-2xl mb-2 font-dancingscript text-amber-100 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-amber-100/80 text-xs sm:text-sm mb-4 font-cinzel leading-relaxed">
                      {item.description}
                    </p>

                    <div className="mt-auto flex items-center gap-4 justify-between">
                      <div className="bg-amber-100/10 backdrop-blur-sm px-3 py-1 rounded-2xl shadow-lg">
                        <span className="text-xl font-bold text-amber-300 font-dancingscript">
                          VND{Number(item.price).toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {quantity > 0 ? (
                          <>
                            <button
                              className="w-8 h-8 rounded-full bg-amber-900/40 flex items-center justify-center hover:bg-amber-800/50 transition-colors"
                              onClick={() => quantity > 1 ? updateQuantity(cartEntry._id, quantity - 1) : removeFromCart(cartEntry._id)}
                            >
                              <FaMinus className="text-amber-100" />
                            </button>
                            <button
                              className="w-8 h-8 rounded-full bg-amber-900/40 flex items-center justify-center hover:bg-amber-800/50 transition-colors"
                              onClick={() => updateQuantity(cartEntry._id, quantity + 1)}
                            >
                              <FaPlus className="text-amber-100" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => addToCart(item, 1)}
                            className="relative px-5 py-2 rounded-full font-cinzel text-sm uppercase tracking-wide
                                      bg-gradient-to-r from-amber-500 to-amber-600 text-white 
                                      shadow-md shadow-amber-900/30 border border-amber-700/50
                                      hover:from-amber-400 hover:to-amber-500 hover:shadow-lg hover:shadow-amber-800/40
                                      transition-all duration-300 ease-out transform hover:scale-105"
                          >
                            <span className="relative z-10">Add to cart</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-amber-200 mt-12 text-lg">
            Không tìm thấy món ăn phù hợp.
          </p>
        )}
      </div>
    </div>
  );
};

export default OurMenu;
