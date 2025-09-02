// admin/src/components/Navbar.jsx
import React, { useState } from 'react';
import { navLinks, styles } from '../assets/dummyadmin';
import { GiChefToque } from 'react-icons/gi';
import { FiMenu, FiX } from 'react-icons/fi';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaComments, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  // Nếu chưa đăng nhập thì không render Navbar
  if (!token) return null;

  return (
    <nav className={styles.navWrapper}>
      <div className={styles.navContainer}>
        {/* Logo */}
        <div className={styles.logoSection}>
          <GiChefToque className={styles.logoIcon} />
          <span className={styles.logoText}>Admin Panel</span>
        </div>

        {/* Menu button (Mobile) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={styles.menuButton}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Desktop Menu */}
        <div className={styles.desktopMenu}>
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.href}
              className={({ isActive }) =>
                `${styles.navLinkBase} ${
                  isActive ? styles.navLinkActive : styles.navLinkInactive
                }`
              }
            >
              {link.icon}
              <span>{link.name}</span>
            </NavLink>
          ))}

          {/* Chat Admin */}
          <NavLink
            to="/admin/chat"
            className={({ isActive }) =>
              `${styles.navLinkBase} ${
                isActive ? styles.navLinkActive : styles.navLinkInactive
              }`
            }
          >
            <FaComments className="mr-1" />
            <span>Chat Admin</span>
          </NavLink>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={`${styles.navLinkBase} border-red-500 text-red-400 hover:bg-red-900/20`}
          >
            <FaSignOutAlt className="mr-1" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.href}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `${styles.navLinkBase} ${
                  isActive ? styles.navLinkActive : styles.navLinkInactive
                }`
              }
            >
              {link.icon}
              <span>{link.name}</span>
            </NavLink>
          ))}

          {/* Chat Admin */}
          <NavLink
            to="/admin/chat"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `${styles.navLinkBase} ${
                isActive ? styles.navLinkActive : styles.navLinkInactive
              }`
            }
          >
            <FaComments className="mr-1" />
            <span>Chat Admin</span>
          </NavLink>

          {/* Logout */}
          <button
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
            className={`${styles.navLinkBase} border-red-500 text-red-400 hover:bg-red-900/20`}
          >
            <FaSignOutAlt className="mr-1" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
