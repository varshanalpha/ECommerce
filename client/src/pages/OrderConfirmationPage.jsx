import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { CheckCircle2, Package, Truck, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { api } from '../api/apiClient';

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fire confetti celebration
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignored
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await api.getOrderById(id);
        if (res.order) {
          setOrder(res.order);
        }
      } catch (err) {
        setError(err.message || 'Failed to retrieve order confirmation');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '45px', height: '45px', border: '3px solid rgba(99, 102, 241, 0.2)', borderTopColor: '#6366f1', borderRadius: '50%' }} className="spinner" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#f87171' }}>Order not found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>{error}</p>
        <Link to="/" className="btn btn-primary">Return to Store</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 6rem', maxWidth: '860px' }}>
      {/* Celebration Header */}
      <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem 2rem', marginBottom: '2rem', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', color: '#34d399' }}>
          <CheckCircle2 size={40} />
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Thank You For Your Order!
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
          A confirmation receipt has been sent to your email. We're currently preparing your items for express dispatch.
        </p>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1.5rem', background: 'var(--bg-secondary)', padding: '0.85rem 1.5rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-medium)', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Order Reference</span>
            <strong style={{ fontSize: '0.9rem', color: '#818cf8', fontFamily: 'monospace' }}>#{order._id.slice(-8).toUpperCase()}</strong>
          </div>
          <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)' }} />
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Tracking Number</span>
            <strong style={{ fontSize: '0.9rem', color: '#34d399', fontFamily: 'monospace' }}>{order.trackingNumber || 'TRK-PENDING'}</strong>
          </div>
        </div>
      </div>

      {/* Order Summary & Details */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem', marginBottom: '2.5rem' }}>
        {/* Shipping summary */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#818cf8' }}>
            <MapPin size={18} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>Shipping Destination</h3>
          </div>
          <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{order.shippingAddress.fullName}</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{order.shippingAddress.street}</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{order.shippingAddress.country}</p>
        </div>

        {/* Payment summary */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#818cf8' }}>
            <ShieldCheck size={18} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>Payment Status</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Method:</span>
            <strong style={{ fontSize: '0.9rem' }}>{order.paymentMethod}</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Status:</span>
            <span className="badge badge-emerald">Paid</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Fulfillment:</span>
            <span className="badge badge-primary">{order.orderStatus}</span>
          </div>
        </div>
      </div>

      {/* Items list */}
      <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
          Purchased Items ({order.orderItems.length})
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          {order.orderItems.map((item) => (
            <div key={item._id || item.product} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img
                src={item.image}
                alt={item.name}
                style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', background: '#0f1624' }}
              />
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{item.name}</h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Qty: {item.quantity} &times; ${item.price.toFixed(2)}
                </div>
              </div>
              <div style={{ fontWeight: 700 }}>
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* Price table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
            <span>Items Subtotal</span>
            <span>${order.itemsPrice.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
            <span>Shipping</span>
            <span>{order.shippingPrice === 0 ? 'FREE' : `$${order.shippingPrice.toFixed(2)}`}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
            <span>Tax</span>
            <span>${order.taxPrice.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.2rem', color: '#fff', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem' }}>
            <span>Total Paid</span>
            <span>${order.totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Navigation actions */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <Link to="/orders" className="btn btn-secondary">
          <Package size={18} />
          <span>View All Orders</span>
        </Link>
        <Link to="/" className="btn btn-primary">
          <span>Continue Shopping</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
