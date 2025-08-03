import React from 'react';
import { navLinks, styles } from '../assets/dummyadmin'
import { GiChefToque } from "react-icons/gi";
import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import { FaComments } from "react-icons/fa"; // Icon chat

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={styles.navWrapper}>
      <div className={styles.navContainer}>
        {/* Logo */}
        <div className={styles.logoSection}>
          <GiChefToque className={styles.logoIcon} />
          <span className={styles.logoText}>Admin Panel</span>
        </div>

        {/* Nút mở menu cho mobile */}
        <button onClick={() => setMenuOpen(!menuOpen)} className={styles.menuButton}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* MENU DESKTOP */}
        <div className={styles.desktopMenu}>
          {navLinks.map(link => (
            <NavLink key={link.name} to={link.href} className={({ isActive }) =>
              `${styles.navLinkBase} ${isActive ? styles.navLinkActive : styles.navLinkInactive}`}>
              {link.icon}
              <span>{link.name}</span>
            </NavLink>
          ))}

          {/* ➕ Nút Chat Admin thêm vào đây */}
          <NavLink
            to="/admin/chat"
            className={({ isActive }) =>
              `${styles.navLinkBase} ${isActive ? styles.navLinkActive : styles.navLinkInactive}`}>
            <FaComments className="mr-1" />
            <span>Chat Admin</span>
          </NavLink>
        </div>
      </div>

      {/* MENU MOBILE */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          {navLinks.map(link => (
            <NavLink
              key={link.name}
              to={link.href}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `${styles.navLinkBase} ${isActive ? styles.navLinkActive : styles.navLinkInactive}`}>
              {link.icon}
              <span>{link.name}</span>
            </NavLink>
          ))}

          {/* ➕ Nút Chat Admin trong mobile menu */}
          <NavLink
            to="/admin/chat"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `${styles.navLinkBase} ${isActive ? styles.navLinkActive : styles.navLinkInactive}`}>
            <FaComments className="mr-1" />
            <span>Chat Admin</span>
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
