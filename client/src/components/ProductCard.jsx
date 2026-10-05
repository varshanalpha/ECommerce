import React from 'react';
import { Star, ShoppingBag, Eye, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, onSelectProduct }) {
  const { addToCart } = useCart();

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  return (
    <div className="product-card">
      {/* Badges container */}
      <div className="product-badges">
        {discountPercent && (
          <span className="badge badge-rose" style={{ boxShadow: '0 2px 8px rgba(244, 63, 94, 0.4)' }}>
            <Zap size={10} /> -{discountPercent}% OFF
          </span>
        )}
        {isLowStock && (
          <span className="badge badge-amber">
            Only {product.stock} left
          </span>
        )}
        {isOutOfStock && (
          <span className="badge" style={{ background: 'rgba(100, 116, 139, 0.3)', color: '#94a3b8' }}>
            Sold Out
          </span>
        )}
      </div>

      {/* Image Wrap */}
      <div
        className="product-image-wrap"
        onClick={() => onSelectProduct && onSelectProduct(product)}
        title="View product details"
      >
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
      </div>

      {/* Details */}
      <div className="product-info">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="product-category">{product.category}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{product.brand}</span>
        </div>

        <h3
          className="product-title"
          onClick={() => onSelectProduct && onSelectProduct(product)}
        >
          {product.name}
        </h3>

        {/* Rating */}
        <div className="product-rating">
          <Star size={14} fill="#fbbf24" color="#fbbf24" />
          <span style={{ fontWeight: 600 }}>{product.rating?.toFixed(1) || '4.8'}</span>
          <span className="product-rating-count">({product.numReviews || 12})</span>
        </div>

        {/* Price & Action */}
        <div className="product-price-row">
          <div className="price-box">
            <span className="current-price">${product.price?.toFixed(2)}</span>
            {product.compareAtPrice && (
              <span className="compare-price">${product.compareAtPrice.toFixed(2)}</span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button
              onClick={() => onSelectProduct && onSelectProduct(product)}
              className="btn btn-secondary btn-icon btn-sm"
              title="Quick view"
              aria-label="Quick view product"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => addToCart(product, 1)}
              disabled={isOutOfStock}
              className="btn btn-primary btn-sm"
              style={{ gap: '0.4rem' }}
            >
              <ShoppingBag size={15} />
              <span>{isOutOfStock ? 'Out of Stock' : 'Add'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
