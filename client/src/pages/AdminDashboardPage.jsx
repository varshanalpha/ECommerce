import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Package,
  ShoppingBag,
  DollarSign,
  Users,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Truck,
  Clock,
  Search,
  X,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { api } from '../api/apiClient';
import { useToast } from '../context/ToastContext';

export default function AdminDashboardPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'products' | 'orders'

  // Analytics State
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  // Products State
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Electronics',
    price: '',
    compareAtPrice: '',
    stock: '',
    brand: 'AeroCraft',
    description: '',
    images: ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80'],
    featured: false
  });

  // Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  // Fetch Analytics
  const loadAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      const res = await api.getAdminAnalytics();
      if (res.data) setAnalytics(res.data);
    } catch (err) {
      console.error('Failed to load analytics:', err.message);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // Fetch Products
  const loadProducts = async () => {
    try {
      setProductsLoading(true);
      const res = await api.getProducts({ limit: 50 });
      if (res.products) setProducts(res.products);
    } catch (err) {
      console.error('Failed to load products:', err.message);
    } finally {
      setProductsLoading(false);
    }
  };

  // Fetch Orders
  const loadOrders = async () => {
    try {
      setOrdersLoading(true);
      const res = await api.getAllOrders({
        status: orderStatusFilter !== 'All' ? orderStatusFilter : undefined,
        limit: 50
      });
      if (res.orders) setOrders(res.orders);
    } catch (err) {
      console.error('Failed to load orders:', err.message);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  useEffect(() => {
    if (activeTab === 'products') loadProducts();
    if (activeTab === 'orders') loadOrders();
  }, [activeTab, orderStatusFilter]);

  // Handle Save / Update Product
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        compareAtPrice: productForm.compareAtPrice ? Number(productForm.compareAtPrice) : null,
        stock: Number(productForm.stock),
        images: Array.isArray(productForm.images) ? productForm.images : [productForm.images]
      };

      if (editingProduct) {
        await api.updateProduct(editingProduct._id, payload);
        toast.success(`Product "${payload.name}" updated!`);
      } else {
        await api.createProduct(payload);
        toast.success(`Product "${payload.name}" created!`);
      }

      setProductModalOpen(false);
      setEditingProduct(null);
      loadProducts();
      loadAnalytics();
    } catch (err) {
      toast.error(err.message || 'Failed to save product');
    }
  };

  // Handle Delete Product
  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await api.deleteProduct(id);
      toast.info(`Deleted "${name}"`);
      loadProducts();
      loadAnalytics();
    } catch (err) {
      toast.error(err.message || 'Failed to delete product');
    }
  };

  // Handle Order Status Update
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      loadOrders();
      loadAnalytics();
    } catch (err) {
      toast.error(err.message || 'Failed to update order status');
    }
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: 'Electronics',
      price: '',
      compareAtPrice: '',
      stock: '25',
      brand: 'AeroCraft',
      description: '',
      images: ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80'],
      featured: true
    });
    setProductModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      category: p.category,
      price: p.price,
      compareAtPrice: p.compareAtPrice || '',
      stock: p.stock,
      brand: p.brand || 'AeroCraft',
      description: p.description,
      images: p.images || ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80'],
      featured: p.featured || false
    });
    setProductModalOpen(true);
  };

  const prefillSampleProduct = () => {
    setProductForm({
      name: 'CyberAcoustic Hi-Res Spatial In-Ear Monitors',
      category: 'Audio',
      price: 249.99,
      compareAtPrice: 299.99,
      stock: 30,
      brand: 'AeroCraft',
      description: 'Custom tuned 12mm graphene planar drivers with beryllium tweeters. Ergonomic CNC aluminum acoustic chamber and MMCX oxygen-free copper braided cable.',
      images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80'],
      featured: true
    });
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 6rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-rose">Admin Portal</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Role-Based Access Control Active</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Store Management & Analytics</h1>
        </div>

        {/* Tab Switchers */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.35rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-medium)' }}>
          <button
            onClick={() => setActiveTab('overview')}
            className={`btn btn-sm ${activeTab === 'overview' ? 'btn-primary' : 'btn-outline'}`}
            style={{ border: 'none' }}
          >
            <BarChart3 size={16} />
            <span>Analytics</span>
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`btn btn-sm ${activeTab === 'products' ? 'btn-primary' : 'btn-outline'}`}
            style={{ border: 'none' }}
          >
            <Package size={16} />
            <span>Products</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`btn btn-sm ${activeTab === 'orders' ? 'btn-primary' : 'btn-outline'}`}
            style={{ border: 'none' }}
          >
            <ShoppingBag size={16} />
            <span>All Orders</span>
          </button>
        </div>
      </div>

      {/* ================= TAB 1: OVERVIEW & ANALYTICS ================= */}
      {activeTab === 'overview' && (
        <div>
          {analyticsLoading ? (
            <div style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '45px', height: '45px', border: '3px solid rgba(99, 102, 241, 0.2)', borderTopColor: '#6366f1', borderRadius: '50%' }} className="spinner" />
            </div>
          ) : analytics ? (
            <>
              {/* Metric KPI Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <DollarSign size={26} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Revenue</span>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>${analytics.summary.totalRevenue.toLocaleString()}</h3>
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-md)', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShoppingBag size={26} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Orders</span>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{analytics.summary.totalOrders}</h3>
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-md)', background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Package size={26} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Live Products</span>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{analytics.summary.totalProducts}</h3>
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-md)', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={26} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Registered Customers</span>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{analytics.summary.totalUsers}</h3>
                  </div>
                </div>
              </div>

              {/* Grid 2 Columns: Category Sales & Low Stock Warnings */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
                {/* Sales by Category */}
                <div className="glass-panel" style={{ padding: '1.75rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                    Sales Breakdown by Category
                  </h3>

                  {analytics.salesByCategory.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No categorized sales recorded yet.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {analytics.salesByCategory.map((cat) => {
                        const maxSales = Math.max(...analytics.salesByCategory.map((c) => c.totalSales), 1);
                        const pct = Math.round((cat.totalSales / maxSales) * 100);
                        return (
                          <div key={cat._id}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.35rem' }}>
                              <strong>{cat._id}</strong>
                              <span style={{ color: '#818cf8', fontWeight: 600 }}>${cat.totalSales.toFixed(2)} ({cat.unitsSold} units)</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', background: 'var(--bg-tertiary)', borderRadius: '9999px', overflow: 'hidden' }}>
                              <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--accent-cyan))' }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Low Stock Alerts */}
                <div className="glass-panel" style={{ padding: '1.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                    <AlertTriangle size={18} color="#f59e0b" />
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Low Stock Inventory Warnings</h3>
                  </div>

                  {analytics.lowStockProducts.length === 0 ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', fontSize: '0.9rem' }}>
                      <CheckCircle2 size={18} />
                      <span>All product inventories are well stocked!</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                      {analytics.lowStockProducts.map((p) => (
                        <div
                          key={p._id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.75rem 1rem',
                            background: 'rgba(245, 158, 11, 0.08)',
                            border: '1px solid rgba(245, 158, 11, 0.25)',
                            borderRadius: 'var(--radius-md)'
                          }}
                        >
                          <div>
                            <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>{p.name}</h4>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{p.category} &bull; ${p.price.toFixed(2)}</span>
                          </div>
                          <span className="badge badge-amber" style={{ fontWeight: 700 }}>
                            {p.stock === 0 ? 'Out of Stock' : `${p.stock} units left`}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="glass-panel" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Recent Customer Orders</h3>
                  <button onClick={() => setActiveTab('orders')} className="btn btn-outline btn-sm">
                    View All Orders
                  </button>
                </div>

                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.recentOrders.map((o) => (
                        <tr key={o._id}>
                          <td style={{ fontFamily: 'monospace', color: '#818cf8', fontWeight: 600 }}>
                            #{o._id.slice(-6).toUpperCase()}
                          </td>
                          <td>
                            <strong>{o.user?.name || 'Customer'}</strong>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{o.user?.email}</div>
                          </td>
                          <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                          <td>{o.orderItems?.length || 0} items</td>
                          <td style={{ fontWeight: 700 }}>${o.totalPrice?.toFixed(2)}</td>
                          <td>
                            <span className={`badge ${
                              o.orderStatus === 'Delivered' ? 'badge-emerald' :
                              o.orderStatus === 'Shipped' ? 'badge-cyan' :
                              o.orderStatus === 'Cancelled' ? 'badge-rose' : 'badge-primary'
                            }`}>
                              {o.orderStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* ================= TAB 2: PRODUCT MANAGEMENT ================= */}
      {activeTab === 'products' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Product Catalog Management ({products.length})</h2>
            <button onClick={openCreateModal} className="btn btn-primary">
              <Plus size={18} />
              <span>Add New Product</span>
            </button>
          </div>

          {productsLoading ? (
            <div style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '40px', height: '40px', border: '3px solid rgba(99, 102, 241, 0.2)', borderTopColor: '#6366f1', borderRadius: '50%' }} className="spinner" />
            </div>
          ) : (
            <div className="table-wrap glass-panel">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id}>
                      <td style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <img
                          src={p.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'}
                          alt={p.name}
                          style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', background: '#0f1624' }}
                        />
                        <div>
                          <strong style={{ fontSize: '0.9rem', display: 'block', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {p.name}
                          </strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.brand}</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-primary">{p.category}</span>
                      </td>
                      <td style={{ fontWeight: 700 }}>${p.price.toFixed(2)}</td>
                      <td>
                        {p.stock > 5 ? (
                          <span className="badge badge-emerald">{p.stock} in stock</span>
                        ) : p.stock > 0 ? (
                          <span className="badge badge-amber">Low: {p.stock}</span>
                        ) : (
                          <span className="badge badge-rose">0 units</span>
                        )}
                      </td>
                      <td>★ {p.rating?.toFixed(1) || '4.8'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => openEditModal(p)}
                            className="btn btn-secondary btn-icon btn-sm"
                            title="Edit Product"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p._id, p.name)}
                            className="btn btn-danger btn-icon btn-sm"
                            title="Delete Product"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 3: ORDER MANAGEMENT ================= */}
      {activeTab === 'orders' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>All Store Orders ({orders.length})</h2>

            {/* Filter by status */}
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Status:</span>
              <select
                className="form-select"
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem', width: 'auto' }}
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {ordersLoading ? (
            <div style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '40px', height: '40px', border: '3px solid rgba(99, 102, 241, 0.2)', borderTopColor: '#6366f1', borderRadius: '50%' }} className="spinner" />
            </div>
          ) : (
            <div className="table-wrap glass-panel">
              <table>
                <thead>
                  <tr>
                    <th>Order & Date</th>
                    <th>Customer</th>
                    <th>Shipping Destination</th>
                    <th>Total</th>
                    <th>Fulfillment Status</th>
                    <th>Change Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o._id}>
                      <td>
                        <strong style={{ fontFamily: 'monospace', color: '#818cf8', display: 'block' }}>
                          #{o._id.slice(-6).toUpperCase()}
                        </strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {new Date(o.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td>
                        <strong>{o.user?.name || 'Customer'}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{o.user?.email}</div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem' }}>{o.shippingAddress?.city}, {o.shippingAddress?.country}</span>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{o.trackingNumber || 'TRK-NONE'}</div>
                      </td>
                      <td style={{ fontWeight: 800 }}>${o.totalPrice?.toFixed(2)}</td>
                      <td>
                        <span className={`badge ${
                          o.orderStatus === 'Delivered' ? 'badge-emerald' :
                          o.orderStatus === 'Shipped' ? 'badge-cyan' :
                          o.orderStatus === 'Cancelled' ? 'badge-rose' : 'badge-primary'
                        }`}>
                          {o.orderStatus}
                        </span>
                      </td>
                      <td>
                        <select
                          className="form-select"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem', width: 'auto', background: 'var(--bg-secondary)' }}
                          value={o.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ================= ADD / EDIT PRODUCT MODAL ================= */}
      {productModalOpen && (
        <div className="modal-overlay" onClick={() => setProductModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                {editingProduct ? 'Edit Product' : 'Add New Product to Store'}
              </h3>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {!editingProduct && (
                  <button
                    type="button"
                    onClick={prefillSampleProduct}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', gap: '0.3rem' }}
                  >
                    <Sparkles size={13} color="#818cf8" />
                    <span>Prefill Sample</span>
                  </button>
                )}
                <button onClick={() => setProductModalOpen(false)} className="modal-close">
                  <X size={18} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveProduct} className="modal-body">
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. AeroSound Studio Pro"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-select"
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Audio">Audio</option>
                    <option value="Wearables">Wearables</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Home Office">Home Office</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Brand</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="AeroCraft"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="form-input"
                    placeholder="199.99"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Compare-At ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    placeholder="249.99"
                    value={productForm.compareAtPrice}
                    onChange={(e) => setProductForm({ ...productForm, compareAtPrice: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    className="form-input"
                    placeholder="25"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL *</label>
                <input
                  type="url"
                  required
                  className="form-input"
                  placeholder="https://images.unsplash.com/..."
                  value={Array.isArray(productForm.images) ? productForm.images[0] : productForm.images}
                  onChange={(e) => setProductForm({ ...productForm, images: [e.target.value] })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Product Description *</label>
                <textarea
                  required
                  rows={4}
                  className="form-textarea"
                  placeholder="Detailed product features, materials, and benefits..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                />
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={productForm.featured}
                  onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                  style={{ accentColor: '#6366f1', width: '16px', height: '16px' }}
                />
                <span style={{ fontSize: '0.875rem' }}>Mark as Featured Item on Home Page</span>
              </label>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
