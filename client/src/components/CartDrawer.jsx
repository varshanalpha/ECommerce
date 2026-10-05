import React, { useEffect } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

export default function CartDrawer() {
  const {
    isDrawerOpen,
    closeDrawer,
    cartItems,
    cartCount,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    updateQuantity,
    removeFromCart
  } = useCart();
  const navigate = useNavigate();

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isDrawerOpen) closeDrawer();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  if (!isDrawerOpen) return null;

  const freeShippingThreshold = 100;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - itemsPrice);
  const freeShippingProgress = Math.min(100, (itemsPrice / freeShippingThreshold) * 100);

  const handleCheckout = () => {
    closeDrawer();
    navigate('/checkout');
  };

  return (
    <div className="drawer-overlay" onClick={closeDrawer}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <ShoppingBag size={20} color="#818cf8" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Your Cart ({cartCount})</h3>
          </div>
          <button onClick={closeDrawer} className="modal-close" aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div style={{
          padding: '0.85rem 1.5rem',
          background: 'var(--bg-tertiary)',
          borderBottom: '1px solid var(--border-subtle)',
          fontSize: '0.82rem'
        }}>
          {amountToFreeShipping > 0 ? (
            <p style={{ color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Add <strong style={{ color: '#fff' }}>${amountToFreeShipping.toFixed(2)}</strong> more to get <strong style={{ color: '#34d399' }}>Free Shipping</strong>!
            </p>
          ) : (
            <p style={{ color: '#34d399', fontWeight: 600, marginBottom: '0.4rem' }}>
              🎉 You unlocked FREE Express Shipping!
            </p>
          )}
          <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${freeShippingProgress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #6366f1, #10b981)',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
        </div>

        {/* Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <ShoppingBag size={28} color="#64748b" />
              </div>
              <h4 style={{ fontSize: '1.05rem', color: '#f8fafc', marginBottom: '0.5rem' }}>Your cart is empty</h4>
              <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>Explore our catalog of high-performance gear.</p>
              <button onClick={closeDrawer} className="btn btn-outline btn-sm">
                Start Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.productId}
                style={{
                  display: 'flex',
                  gap: '1rem',
                  padding: '0.85rem',
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  alignItems: 'center'
                }}
              >
                {/* Thumbnail */}
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'}
                  alt={item.name}
                  style={{
                    width: '64px',
                    height: '64px',
                    objectFit: 'cover',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: '#0f1624'
                  }}
                />

                {/* Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    marginBottom: '0.25rem'
                  }}>
                    {item.name}
                  </h4>
                  <div style={{ fontSize: '0.85rem', color: '#818cf8', fontWeight: 700, marginBottom: '0.4rem' }}>
                    ${item.price?.toFixed(2)}
                  </div>

                  {/* Quantity controls */}
                  <div style={{ display: 'inline-flex', alignItems: 'center', background: 'var(--bg-input)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)' }}>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      style={{ padding: '0.15rem 0.5rem', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '0.9rem' }}
                    >
                      -
                    </button>
                    <span style={{ padding: '0 0.5rem', fontSize: '0.8rem', fontWeight: 600 }}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      style={{ padding: '0.15rem 0.5rem', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '0.9rem' }}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="btn-icon"
                  style={{ width: '32px', height: '32px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  title="Remove item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer & Checkout */}
        {cartItems.length > 0 && (
          <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-tertiary)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Subtotal</span>
                <span>${itemsPrice.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Shipping</span>
                <span>{shippingPrice === 0 ? <span style={{ color: '#34d399' }}>FREE</span> : `$${shippingPrice.toFixed(2)}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Estimated Tax (8%)</span>
                <span>${taxPrice.toFixed(2)}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '0.6rem',
                borderTop: '1px solid var(--border-subtle)',
                fontWeight: 700,
                fontSize: '1.1rem',
                color: '#fff'
              }}>
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <button
                onClick={handleCheckout}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', gap: '0.65rem' }}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={18} />
              </button>

              <Link
                to="/cart"
                onClick={closeDrawer}
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', textAlign: 'center' }}
              >
                View Detailed Cart
              </Link>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '0.85rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              <ShieldCheck size={14} color="#10b981" />
              <span>Encrypted 256-Bit SSL Checkout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
