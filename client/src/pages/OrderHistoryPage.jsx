import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, Truck, CheckCircle2, ChevronRight, ExternalLink } from 'lucide-react';
import { api } from '../api/apiClient';

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await api.getMyOrders();
        if (res.orders) {
          setOrders(res.orders);
        }
      } catch (err) {
        console.error('Failed to load orders:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return <span className="badge badge-emerald"><CheckCircle2 size={12} /> Delivered</span>;
      case 'Shipped':
        return <span className="badge badge-cyan"><Truck size={12} /> Shipped</span>;
      case 'Processing':
        return <span className="badge badge-primary"><Clock size={12} /> Processing</span>;
      case 'Cancelled':
        return <span className="badge badge-rose">Cancelled</span>;
      default:
        return <span className="badge badge-amber">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '45px', height: '45px', border: '3px solid rgba(99, 102, 241, 0.2)', borderTopColor: '#6366f1', borderRadius: '50%' }} className="spinner" />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 6rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Order History</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Track and review all your previous purchases and deliveries
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
          <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Package size={32} color="#818cf8" />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No orders found</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            You haven't placed any orders yet. Discover our top-rated audio and electronics gear!
          </p>
          <Link to="/" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map((order) => (
            <div key={order._id} className="glass-panel" style={{ padding: '1.5rem' }}>
              {/* Top row: order meta */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                borderBottom: '1px solid var(--border-subtle)',
                paddingBottom: '1rem',
                marginBottom: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Order Date</span>
                    <strong style={{ fontSize: '0.9rem' }}>{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Total Amount</span>
                    <strong style={{ fontSize: '0.9rem', color: '#fff' }}>${order.totalPrice?.toFixed(2)}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Tracking</span>
                    <span style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: '#818cf8' }}>{order.trackingNumber || 'N/A'}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {getStatusBadge(order.orderStatus)}
                  <Link
                    to={`/order-confirmation/${order._id}`}
                    className="btn btn-outline btn-sm"
                    style={{ gap: '0.35rem' }}
                  >
                    <span>View Receipt</span>
                    <ExternalLink size={14} />
                  </Link>
                </div>
              </div>

              {/* Items row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                {order.orderItems.map((item) => (
                  <div key={item._id || item.product} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', background: '#0f1624' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.name}
                      </h4>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Qty: {item.quantity} &times; ${item.price?.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
