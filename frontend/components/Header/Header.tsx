"use client";

import React, { useState, useRef, useEffect } from "react";
import "./Header.css";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistItems } = useWishlist();
  const pathname = usePathname();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openDropdown = () => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setIsDropdownOpen(true);
  };

  const closeDropdown = () => {
    dropdownTimeout.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200); // 200ms grace period to bridge the gap
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Designers", href: "/designers" },
    { name: "Blog", href: "/blog" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <div className={`header ${isMenuOpen ? "menu-open" : ""}`}>
      {/* Mobile Menu Toggle */}
      <button 
        className="mobile-menu-toggle only-mobile" 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle Menu"
      >
        <div className={`hamburger ${isMenuOpen ? "open" : ""}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      {/* Left Side */}
      <div className="header-box-left">
        <div className="logo">
          <Link href="/">
            <img src="/Farshe Logo.png" alt="Logo" />
          </Link>
        </div>
        <div className="heading hidden-mobile">
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h1 className="main-title">Fārshē</h1>
          </Link>
        </div>
      </div>

      {/* Right Side */}
      <div className="header-box-right">
        {user ? (
          <div className="user-dropdown-container hidden-mobile" ref={dropdownRef}>
            <button 
              className={`user-dropdown-trigger ${isDropdownOpen ? 'active' : ''}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              onMouseEnter={openDropdown}
              onMouseLeave={closeDropdown}
            >
              <div className="user-avatar">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="user-name">Salam, {user.name.split(' ')[0]}</span>
              <span className="dropdown-arrow">▼</span>
            </button>
            
            {isDropdownOpen && (
              <div 
                className="user-dropdown-menu"
                onMouseEnter={openDropdown}
                onMouseLeave={closeDropdown}
              >
                <div className="dropdown-header">
                  <p className="user-full-name">{user.name}</p>
                  <p className="user-email">{user.email}</p>
                </div>
                <div className="dropdown-divider"></div>
                <Link href="/orders" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                  <span className="item-icon">📦</span>
                  My Orders
                </Link>
                <Link href="/dashboard" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                  <span className="item-icon">🏛️</span>
                  Heritage Hub
                </Link>
                {user.isAdmin && (
                  <Link href="/admin" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                    <span className="item-icon">⚙️</span>
                    Admin Panel
                  </Link>
                )}
                <div className="dropdown-divider"></div>
                <button 
                  className="dropdown-item logout" 
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsLogoutModalOpen(true);
                  }}
                >
                  <span className="item-icon">🚪</span>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="account-icon hidden-mobile">
            <Link href="/login">
              <button>
                <img src="/account logo.svg" alt="Login" />
              </button>
            </Link>
          </div>
        )}
        <div className="cart-icon">
          <Link href="/wishlist">
            <button className="cart-btn wishlist-btn">
              <span className="icon">🏺</span>
              {wishlistItems.length > 0 && <span className="cart-badge wishlist-badge">{wishlistItems.length}</span>}
            </button>
          </Link>
        </div>
        <div className="cart-icon">
          <Link href="/cart">
            <button className="cart-btn">
              <img src="/cart logo.svg" alt="Cart" />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          </Link>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMenuOpen ? "active" : ""}`}>
        <nav className="mobile-nav">
          <ul>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} onClick={() => setIsMenuOpen(false)}>
                  {link.name}
                </Link>
              </li>
            ))}
            <div className="mobile-auth-section">
              {user ? (
                <>
                  <span className="mobile-user-name">Salam, {user.name}</span>
                  <Link href="/orders" className="btn-mobile-nav-item" onClick={() => setIsMenuOpen(false)}>
                    <span className="icon">📦</span> My Orders
                  </Link>
                  <Link href="/settings" className="btn-mobile-nav-item" onClick={() => setIsMenuOpen(false)}>
                    <span className="icon">⚙️</span> Settings
                  </Link>
                  <button 
                    onClick={() => { setIsLogoutModalOpen(true); setIsMenuOpen(false); }} 
                    className="btn-mobile-logout"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/login" className="btn-mobile-login" onClick={() => setIsMenuOpen(false)}>
                  Login / Sign Up
                </Link>
              )}
            </div>
          </ul>
        </nav>
      </div>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="logout-modal-backdrop">
          <div className="logout-modal">
            <h2>Confirm Logout</h2>
            <p>Are you sure you want to sign out?</p>
            <div className="logout-modal-actions">
              <button 
                className="logout-btn-cancel"
                onClick={() => setIsLogoutModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="logout-btn-confirm"
                onClick={() => {
                  setIsLogoutModalOpen(false);
                  logout();
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
