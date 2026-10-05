import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft, ArrowRight, ShieldCheck, Tag, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function CartPage() {
  const {
    cartItems,
    cartCount,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    updateQuantity,
    removeFromCart,
    clearCart
  } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'AERO10') {
      const disc = Number((itemsPrice * 0.1).toFixed(2));
      setDiscount(disc);
      toast.success('Promo code AERO10 applied! 10% discount');
    } else {
      toast.error('Invalid promo code. Try "AERO10"');
    }
  };

  const finalTotal = Math.max(0, Number((totalPrice - discount).toFixed(2)));

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <div style={{
          maxWidth: '480px',
          margin: '0 auto',
          background: 'var(--bg-card)',
          padding: '3.5rem 2rem',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <ShoppingBag size={36} color="#818cf8" />
          </div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '0.75rem' }}>Your shopping cart is empty</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Looks like you haven't added anything to your cart yet. Discover our top-rated audio and electronics gear.
          </p>
          <Link to="/" className="btn btn-primary btn-lg">
            <span>Explore Collection</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Shopping Cart</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Review your {cartCount} {cartCount === 1 ? 'item' : 'items'} before checkout
          </p>
        </div>
        <button
          onClick={clearCart}
          className="btn btn-outline btn-sm"
          style={{ color: '#fda4af', borderColor: 'rgba(244,63,94,0.3)' }}
        >
          <Trash2 size={15} />
          <span>Clear All</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        {/* Cart items list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cartItems.map((item) => (
            <div
              key={item.productId}
              className="glass-panel"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                padding: '1.25rem',
                flexWrap: 'wrap'
              }}
            >
              <img
                src={item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'}
                alt={item.name}
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: 'var(--radius-md)',
                  objectFit: 'cover',
                  background: '#0f1624'
                }}
              />

              <div style={{ flex: '1 1 200px' }}>
                <span className="badge badge-primary" style={{ marginBottom: '0.35rem' }}>
                  {item.category || 'Gear'}
                </span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  {item.name}
                </h3>
                <div style={{ color: '#818cf8', fontWeight: 700, fontSize: '1.1rem' }}>
                  ${item.price?.toFixed(2)}
                </div>
              </div>

              {/* Quantity Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', background: 'var(--bg-input)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)' }}>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    style={{ padding: '0.35rem 0.75rem', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1rem' }}
                  >
                    -
                  </button>
                  <span style={{ padding: '0 0.6rem', fontWeight: 700, fontSize: '0.9rem' }}>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    style={{ padding: '0.35rem 0.75rem', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1rem' }}
                  >
                    +
                  </button>
                </div>

                <div style={{ minWidth: '85px', textAlign: 'right', fontWeight: 700, fontSize: '1.1rem' }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </div>

                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="btn-icon"
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  title="Remove item"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}

          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#818cf8', fontWeight: 600, fontSize: '0.9rem', marginTop: '0.5rem' }}>
            <ArrowLeft size={16} />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {/* Summary Card */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            Order Summary
          </h2>

          {/* Promo code form */}
          <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <input
              type="text"
              placeholder="Promo code (try AERO10)"
              className="form-input"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              style={{ textTransform: 'uppercase' }}
            />
            <button type="submit" className="btn btn-secondary btn-sm" style={{ whiteSpace: 'nowrap' }}>
              Apply
            </button>
          </form>

          {/* Breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Items Subtotal</span>
              <span>${itemsPrice.toFixed(2)}</span>
            </div>

            {discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34d399' }}>
                <span>Discount (AERO10)</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Shipping</span>
              <span>{shippingPrice === 0 ? <span style={{ color: '#34d399' }}>FREE</span> : `$${shippingPrice.toFixed(2)}`}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Estimated Sales Tax (8%)</span>
              <span>${taxPrice.toFixed(2)}</span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-subtle)',
              fontSize: '1.3rem',
              fontWeight: 800,
              color: '#ffffff'
            }}>
              <span>Total</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginBottom: '1rem' }}
          >
            <span>Proceed to Checkout</span>
            <ArrowRight size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <ShieldCheck size={16} color="#10b981" />
            <span>Guaranteed Safe & Secure Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
}
