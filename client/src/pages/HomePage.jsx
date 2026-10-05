import React, { useState, useEffect } from 'react';
import { api } from '../api/apiClient';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';
import {
  Sparkles,
  SlidersHorizontal,
  ArrowUpDown,
  CheckCircle,
  Package,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function HomePage({ searchQuery, setSearchQuery }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState(600);

  // Fetch categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.getCategories();
        if (res.categories) {
          setCategories(res.categories);
        }
      } catch (err) {
        console.error('Failed to load categories:', err.message);
      }
    };
    fetchCats();
  }, []);

  // Fetch products with search, category, sort, stock filters
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {
          keyword: searchQuery || undefined,
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          sort: selectedSort,
          inStock: inStockOnly ? 'true' : undefined,
          maxPrice: priceRange < 600 ? priceRange : undefined,
          limit: 30
        };
        const res = await api.getProducts(params);
        if (res.products) {
          setProducts(res.products);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err.message);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchProducts, 150);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedCategory, selectedSort, inStockOnly, priceRange]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedSort('newest');
    setInStockOnly(false);
    setPriceRange(600);
    if (setSearchQuery) setSearchQuery('');
  };

  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-pill">
          <Sparkles size={14} />
          <span>New 2026 Collection Available Now</span>
        </div>
        <h1 className="hero-title">
          Engineered for <span className="gradient-text">Pure Precision</span> & Performance.
        </h1>
        <p className="hero-subtitle">
          Immerse yourself in audiophile-grade wireless acoustics, titanium wearables, and ultra-minimalist workstation essentials.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <a href="#catalog" className="btn btn-primary btn-lg">
            <span>Explore Catalog</span>
            <ArrowRight size={18} />
          </a>
          <button
            onClick={() => {
              setSelectedCategory('Audio');
              const el = document.getElementById('catalog');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="btn btn-secondary btn-lg"
          >
            <span>Audio Collection</span>
          </button>
        </div>
      </section>

      {/* Catalog & Filter Bar */}
      <section id="catalog" style={{ scrollMarginTop: '90px' }}>
        <div className="filter-bar">
          {/* Category Pills */}
          <div className="category-pills">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`category-pill ${selectedCategory === 'All' ? 'active' : ''}`}
            >
              All Gear
            </button>
            {categories.map((cat) => (
              <button
                key={cat.category}
                onClick={() => setSelectedCategory(cat.category)}
                className={`category-pill ${selectedCategory === cat.category ? 'active' : ''}`}
              >
                {cat.category} ({cat.count})
              </button>
            ))}
          </div>

          {/* Controls: Sort & Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {/* Sort Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ArrowUpDown size={15} color="var(--text-muted)" />
              <select
                className="form-select"
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem', width: 'auto', background: 'var(--bg-secondary)' }}
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="name-asc">Alphabetical</option>
              </select>
            </div>

            {/* In stock toggle */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                style={{ accentColor: '#6366f1', width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </div>

        {/* Search / Filter Active Indicator */}
        {(searchQuery || selectedCategory !== 'All' || inStockOnly || priceRange < 600) && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', padding: '0.65rem 1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>
              Showing {products.length} {products.length === 1 ? 'result' : 'results'} {searchQuery && `matching "${searchQuery}"`} {selectedCategory !== 'All' && `in ${selectedCategory}`}
            </span>
            <button
              onClick={handleResetFilters}
              style={{ background: 'none', border: 'none', color: '#818cf8', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div style={{ minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
            <div style={{ width: '45px', height: '45px', border: '3px solid rgba(99, 102, 241, 0.2)', borderTopColor: '#6366f1', borderRadius: '50%' }} className="spinner" />
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Loading premium products...</p>
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1.5rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
            <Package size={48} color="#64748b" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No products match your criteria</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
              Try adjusting your search keyword or clearing active filters to see all available items.
            </p>
            <button onClick={handleResetFilters} className="btn btn-primary btn-sm">
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onSelectProduct={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
