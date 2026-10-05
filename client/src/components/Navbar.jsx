import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  User as UserIcon,
  Shield,
  Package,
  LogOut,
  LogIn,
  Search,
  ChevronDown,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar({ searchQuery, setSearchQuery }) {
  const { user, isAdmin, logout } = useAuth();
  const { cartCount, openDrawer } = useCart();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container nav-content">
        {/* Brand Logo */}
        <Link to="/" className="nav-brand">
          <div className="nav-brand-icon">
            <Sparkles size={20} />
          </div>
          <span>Aero<span className="gradient-text-accent">Store</span></span>
        </Link>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="nav-search">
          <Search size={18} className="nav-search-icon" />
          <input
            type="text"
            placeholder="Search audio, watches, tech gear..."
            value={searchQuery || ''}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
          />
        </form>

        {/* Right Actions */}
        <div className="nav-actions">
          <Link to="/" className="btn btn-outline btn-sm" style={{ border: 'none' }}>
            Store
          </Link>

          {isAdmin && (
            <Link to="/admin" className="btn btn-sm" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
              <Shield size={15} />
              <span>Admin Portal</span>
            </Link>
          )}

          {/* Cart Button */}
          <button
            onClick={openDrawer}
            className="btn btn-secondary btn-icon cart-btn"
            title="Shopping Cart"
            aria-label="View Shopping Cart"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>

          {/* User Account Dropdown */}
          <div className="dropdown" ref={dropdownRef}>
            {user ? (
              <>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '0.4rem' }}
                >
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: isAdmin ? 'linear-gradient(135deg, #f43f5e, #ec4899)' : 'linear-gradient(135deg, #6366f1, #06b6d4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#fff'
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.name}
                  </span>
                  <ChevronDown size={14} color="#94a3b8" />
                </button>

                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <div style={{ padding: '0.5rem 0.85rem' }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>{user.name}</p>
                      <p style={{ fontSize: '0.75rem', color: '#94a3b8', wordBreak: 'break-all' }}>{user.email}</p>
                      <span className={`badge ${isAdmin ? 'badge-rose' : 'badge-primary'}`} style={{ marginTop: '0.4rem' }}>
                        {user.role}
                      </span>
                    </div>
                    <div className="dropdown-divider" />

                    <Link
                      to="/orders"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Package size={16} />
                      <span>My Orders</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Shield size={16} />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <div className="dropdown-divider" />
                    <button
                      onClick={handleLogout}
                      className="dropdown-item"
                      style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: '#fda4af' }}
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link to="/login" className="btn btn-outline btn-sm">
                  <LogIn size={15} />
                  <span>Sign In</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
