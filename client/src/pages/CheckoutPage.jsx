import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CreditCard,
  Truck,
  ShieldCheck,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { api } from '../api/apiClient';

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');

  // Shipping form state
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    phone: ''
  });

  // Credit card mockup state
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '4242 •••• •••• 4242',
    cardHolder: user?.name?.toUpperCase() || 'ALEX RIVERA',
    expiry: '12/28',
    cvv: '888'
  });

  // Prefill address if user has saved addresses
  useEffect(() => {
    if (user?.addresses && user.addresses.length > 0) {
      const def = user.addresses.find((a) => a.isDefault) || user.addresses[0];
      setShippingAddress((prev) => ({
        ...prev,
        fullName: user.name || '',
        street: def.street || '',
        city: def.city || '',
        state: def.state || '',
        postalCode: def.postalCode || '',
        country: def.country || 'United States'
      }));
    }
  }, [user]);

  // If cart is empty, redirect back to store
  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No items in cart to checkout</h2>
        <Link to="/" className="btn btn-primary">
          Back to Store
        </Link>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!shippingAddress.fullName || !shippingAddress.street || !shippingAddress.city || !shippingAddress.postalCode) {
      toast.error('Please complete all required shipping fields');
      return;
    }

    try {
      setLoading(true);

      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          product: item.productId,
          quantity: item.quantity
        })),
        shippingAddress,
        paymentMethod
      };

      const res = await api.createOrder(orderPayload);

      if (res.order) {
        await clearCart();
        toast.success('Order placed successfully!');
        navigate(`/order-confirmation/${res.order._id}`);
      }
    } catch (err) {
      console.error('Order placement failed:', err);
      toast.error(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 5rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Complete Your Order</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Fast, encrypted checkout for <strong style={{ color: '#fff' }}>{user?.email}</strong>
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
        {/* Left Column: Shipping & Payment Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Section 1: Shipping Address */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                1
              </div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Shipping Address</h2>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="fullName"
                required
                className="form-input"
                placeholder="Alex Rivera"
                value={shippingAddress.fullName}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Street Address *</label>
              <input
                type="text"
                name="street"
                required
                className="form-input"
                placeholder="742 Evergreen Terrace, Apt 4B"
                value={shippingAddress.street}
                onChange={handleInputChange}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">City *</label>
                <input
                  type="text"
                  name="city"
                  required
                  className="form-input"
                  placeholder="Springfield"
                  value={shippingAddress.city}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">State / Province</label>
                <input
                  type="text"
                  name="state"
                  className="form-input"
                  placeholder="Oregon"
                  value={shippingAddress.state}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Postal / ZIP Code *</label>
                <input
                  type="text"
                  name="postalCode"
                  required
                  className="form-input"
                  placeholder="97477"
                  value={shippingAddress.postalCode}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  placeholder="+1 (555) 019-2834"
                  value={shippingAddress.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Payment Method */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                2
              </div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Payment Method</h2>
            </div>

            {/* Payment method selection tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {['Credit Card', 'PayPal', 'Cash on Delivery'].map((method) => (
                <button
                  type="button"
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  style={{
                    padding: '0.85rem 0.5rem',
                    borderRadius: 'var(--radius-md)',
                    border: paymentMethod === method ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                    background: paymentMethod === method ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-input)',
                    color: paymentMethod === method ? '#fff' : 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <CreditCard size={18} color={paymentMethod === method ? '#818cf8' : '#94a3b8'} />
                  <span>{method}</span>
                </button>
              ))}
            </div>

            {/* Mock Credit Card UI */}
            {paymentMethod === 'Credit Card' && (
              <div style={{
                background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                border: '1px solid rgba(99,102,241,0.4)',
                marginBottom: '1rem',
                color: '#fff',
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.8 }}>AeroCraft Titanium Card</span>
                  <Lock size={16} color="#818cf8" />
                </div>

                <div style={{ fontSize: '1.25rem', fontFamily: 'monospace', letterSpacing: '0.15em', marginBottom: '1.5rem' }}>
                  {cardDetails.cardNumber}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  <div>
                    <div style={{ opacity: 0.7, fontSize: '0.7rem' }}>Cardholder</div>
                    <div style={{ fontWeight: 600 }}>{cardDetails.cardHolder}</div>
                  </div>
                  <div>
                    <div style={{ opacity: 0.7, fontSize: '0.7rem' }}>Expires</div>
                    <div style={{ fontWeight: 600 }}>{cardDetails.expiry}</div>
                  </div>
                  <div>
                    <div style={{ opacity: 0.7, fontSize: '0.7rem' }}>CVV</div>
                    <div style={{ fontWeight: 600 }}>{cardDetails.cvv}</div>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'PayPal' && (
              <div style={{ padding: '1.25rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', textAlign: 'center' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  You will be safely routed to PayPal to complete your instant authorization.
                </p>
              </div>
            )}

            {paymentMethod === 'Cash on Delivery' && (
              <div style={{ padding: '1.25rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', textAlign: 'center' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Pay cash directly upon courier delivery at your doorstep.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Review & Submit */}
        <div className="glass-panel" style={{ padding: '1.75rem', position: 'sticky', top: '90px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            Order Items ({cartItems.length})
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '260px', overflowY: 'auto', marginBottom: '1.5rem' }}>
            {cartItems.map((item) => (
              <div key={item.productId} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', background: '#0f1624' }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Qty: {item.quantity} &times; ${item.price?.toFixed(2)}
                  </div>
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Totals Breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Subtotal</span>
              <span>${itemsPrice.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Shipping</span>
              <span>{shippingPrice === 0 ? <span style={{ color: '#34d399' }}>FREE</span> : `$${shippingPrice.toFixed(2)}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Tax (8%)</span>
              <span>${taxPrice.toFixed(2)}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--border-subtle)',
              fontSize: '1.3rem',
              fontWeight: 800,
              color: '#fff'
            }}>
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginBottom: '1rem' }}
          >
            {loading ? (
              <div style={{ width: '22px', height: '22px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%' }} className="spinner" />
            ) : (
              <>
                <Lock size={18} />
                <span>Place Order (${totalPrice.toFixed(2)})</span>
              </>
            )}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <ShieldCheck size={16} color="#10b981" />
            <span>256-Bit Bank Grade SSL Encryption</span>
          </div>
        </div>
      </form>
    </div>
  );
}
