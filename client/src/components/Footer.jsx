import React from 'react';
import { Sparkles, ShieldCheck, Truck, RefreshCw, Headphones, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ marginTop: '5rem', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', padding: '3.5rem 0 2rem' }}>
      <div className="container">
        {/* Value proposition badges */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          paddingBottom: '3rem',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '3rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
              <Truck size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Free Express Delivery</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>On all orders over $100</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>2-Year Warranty</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>100% authentic premium gear</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22d3ee' }}>
              <RefreshCw size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>30-Day Money Back</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>No questions asked returns</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24' }}>
              <Headphones size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>24/7 Priority Support</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Dedicated concierge team</p>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={16} color="#818cf8" />
            <span style={{ fontWeight: 700, color: '#f8fafc' }}>AeroStore</span>
            <span>&copy; {new Date().getFullYear()} — Production Ready Full-Stack E-Commerce</span>
          </div>

          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <span className="badge badge-primary">React + Vite</span>
            <span className="badge badge-cyan">Express + Node.js</span>
            <span className="badge badge-emerald">MongoDB</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
