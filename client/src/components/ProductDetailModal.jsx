import React, { useState, useEffect } from 'react';
import { X, Star, ShoppingBag, Check, Shield, Truck, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function ProductDetailModal({ product, onClose }) {
  const { addToCart, openDrawer } = useCart();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setSelectedImage(0);
    setQuantity(1);
    setAdded(false);
  }, [product]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'];

  const handleAddToCart = async () => {
    const success = await addToCart(product, quantity);
    if (success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const handleBuyNow = async () => {
    await addToCart(product, quantity);
    onClose();
    navigate('/checkout');
  };

  const isOutOfStock = product.stock === 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '850px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span className="badge badge-primary">{product.category}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{product.brand}</span>
          </div>
          <button onClick={onClose} className="modal-close" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Images Section */}
          <div>
            <div style={{
              width: '100%',
              paddingTop: '80%',
              position: 'relative',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              backgroundColor: '#0f1624',
              border: '1px solid var(--border-subtle)',
              marginBottom: '1rem'
            }}>
              <img
                src={images[selectedImage]}
                alt={product.name}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto' }}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      border: selectedImage === idx ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                      background: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      opacity: selectedImage === idx ? 1 : 0.6,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>{product.name}</h2>

            {/* Rating & Stock */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div className="product-rating" style={{ margin: 0 }}>
                <Star size={16} fill="#fbbf24" color="#fbbf24" />
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{product.rating?.toFixed(1) || '4.8'}</span>
                <span className="product-rating-count">({product.numReviews || 12} customer reviews)</span>
              </div>

              <div>
                {product.stock > 5 ? (
                  <span className="badge badge-emerald">In Stock ({product.stock})</span>
                ) : product.stock > 0 ? (
                  <span className="badge badge-amber">Only {product.stock} Left!</span>
                ) : (
                  <span className="badge badge-rose">Out of Stock</span>
                )}
              </div>
            </div>

            {/* Price Row */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#fff' }}>
                ${product.price?.toFixed(2)}
              </span>
              {product.compareAtPrice && (
                <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '1.05rem' }}>
                  ${product.compareAtPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {product.description}
            </p>

            {/* Specs Table */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div style={{ marginBottom: '1.5rem', background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary-light)', marginBottom: '0.65rem' }}>
                  Key Specifications
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.65rem', fontSize: '0.82rem' }}>
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div key={key}>
                      <span style={{ color: 'var(--text-muted)' }}>{key}: </span>
                      <strong style={{ color: 'var(--text-primary)' }}>{val}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Actions */}
            <div style={{ marginTop: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Quantity:</span>
                <div style={{ display: 'inline-flex', alignItems: 'center', background: 'var(--bg-input)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)' }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    style={{ padding: '0.4rem 0.85rem', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.1rem' }}
                  >
                    -
                  </button>
                  <span style={{ padding: '0 0.75rem', fontWeight: 700, fontSize: '0.95rem' }}>{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock || isOutOfStock}
                    style={{ padding: '0.4rem 0.85rem', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.1rem' }}
                  >
                    +
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="btn btn-primary"
                  style={{ flex: 1, minWidth: '160px' }}
                >
                  {added ? <Check size={18} /> : <ShoppingBag size={18} />}
                  <span>{added ? 'Added to Cart!' : isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="btn btn-secondary"
                  style={{ flex: 1, minWidth: '160px', borderColor: 'var(--primary)' }}
                >
                  <Zap size={18} color="#818cf8" />
                  <span>Buy Now</span>
                </button>
              </div>

              {/* Guarantees */}
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Truck size={14} color="#818cf8" /> Fast Dispatch
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Shield size={14} color="#10b981" /> 2-Yr Warranty
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
