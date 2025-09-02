// admin/src/components/Navbar.jsx
import React, { useState } from "react";
import { navLinks, styles } from "../assets/dummyadmin";
import { GiChefToque } from "react-icons/gi";
import { FiMenu, FiX } from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import { FaComments, FaSignOutAlt } from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // ❌ Nếu chưa login thì không render Navbar
  if (!token) return null;

  // 🔹 Menu theo role
  const getMenuLinks = () => {
    if (role === "admin") return navLinks;
    if (role === "staff") {
      return [
        {
          name: "Orders",
          href: "/orders",
          icon: navLinks.find((l) => l.name === "Orders")?.icon,
        },
        { name: "Chat Admin", href: "/admin/chat", icon: <FaComments className="mr-1" /> },
      ];
    }
    if (role === "user") {
      return [{ name: "Chat Admin", href: "/admin/chat", icon: <FaComments className="mr-1" /> }];
    }
    return [];
  };

  const menuLinks = getMenuLinks();

  return (
    <nav className={styles.navWrapper}>
      <div className={styles.navContainer}>
        {/* Logo */}
        <div className={styles.logoSection}>
          <GiChefToque className={styles.logoIcon} />
          <span className={styles.logoText}>
            Admin Panel{" "}
            <span className="text-xs ml-1 text-amber-400 uppercase">
              ({role})
            </span>
          </span>
        </div>

        {/* Nút menu Mobile */}
        <button onClick={() => setMenuOpen(!menuOpen)} className={styles.menuButton}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Menu Desktop */}
        <div className={styles.desktopMenu}>
          {menuLinks.map((link) => (
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

      {/* Menu Mobile */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          {menuLinks.map((link) => (
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
