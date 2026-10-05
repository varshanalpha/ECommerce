import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/apiClient';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync cart on login or user change
  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        try {
          setLoading(true);
          const res = await api.getCart();
          if (res.cart && res.cart.items) {
            // Map backend cart item schema to uniform structure
            const formatted = res.cart.items.map((item) => ({
              product: item.product,
              productId: item.product._id,
              name: item.product.name,
              price: item.product.price,
              image: item.product.images?.[0] || '',
              stock: item.product.stock,
              category: item.product.category,
              quantity: item.quantity
            }));
            setCartItems(formatted);
          }
        } catch (err) {
          console.error('Error fetching backend cart:', err.message);
        } finally {
          setLoading(false);
        }
      } else {
        // Guest mode: load from localStorage
        const localCart = localStorage.getItem('local_cart');
        if (localCart) {
          try {
            setCartItems(JSON.parse(localCart));
          } catch {
            setCartItems([]);
          }
        } else {
          setCartItems([]);
        }
      }
    };

    loadCart();
  }, [user]);

  // Persist guest cart to localStorage
  useEffect(() => {
    if (!user) {
      localStorage.setItem('local_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const addToCart = async (product, quantity = 1) => {
    const existing = cartItems.find((item) => item.productId === product._id);
    const currentQty = existing ? existing.quantity : 0;
    const requestedTotal = currentQty + quantity;

    if (requestedTotal > product.stock) {
      toast.error(`Only ${product.stock} items available in stock`);
      return false;
    }

    if (user) {
      try {
        await api.addToCart(product._id, quantity);
        // Refresh cart from server
        const res = await api.getCart();
        const formatted = res.cart.items.map((item) => ({
          product: item.product,
          productId: item.product._id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.images?.[0] || '',
          stock: item.product.stock,
          category: item.product.category,
          quantity: item.quantity
        }));
        setCartItems(formatted);
      } catch (err) {
        toast.error(err.message || 'Failed to add item to cart');
        return false;
      }
    } else {
      // Local state update
      setCartItems((prev) => {
        const itemIdx = prev.findIndex((i) => i.productId === product._id);
        if (itemIdx > -1) {
          const next = [...prev];
          next[itemIdx].quantity += quantity;
          return next;
        } else {
          return [
            ...prev,
            {
              product,
              productId: product._id,
              name: product.name,
              price: product.price,
              image: product.images?.[0] || '',
              stock: product.stock,
              category: product.category,
              quantity
            }
          ];
        }
      });
    }

    toast.success(`Added "${product.name}" to cart`);
    setIsDrawerOpen(true);
    return true;
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;

    if (user) {
      try {
        await api.updateCartItem(productId, quantity);
        setCartItems((prev) =>
          prev.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          )
        );
      } catch (err) {
        toast.error(err.message || 'Failed to update quantity');
      }
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeFromCart = async (productId) => {
    if (user) {
      try {
        await api.removeFromCart(productId);
        setCartItems((prev) => prev.filter((item) => item.productId !== productId));
      } catch (err) {
        toast.error(err.message || 'Failed to remove item');
      }
    } else {
      setCartItems((prev) => prev.filter((item) => item.productId !== productId));
    }
    toast.info('Item removed from cart');
  };

  const clearCart = async () => {
    if (user) {
      try {
        await api.clearCart();
      } catch (err) {
        console.error('Failed to clear backend cart:', err.message);
      }
    }
    setCartItems([]);
    localStorage.removeItem('local_cart');
  };

  // Calculations
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingPrice = itemsPrice >= 100 || itemsPrice === 0 ? 0 : 10;
  const taxPrice = Number((0.08 * itemsPrice).toFixed(2));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        loading,
        isDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
