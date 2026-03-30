"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size: string;
  color: string;
  cartItemId?: string; // Unique identifier for cart item (id + size + color)
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('woodmaps-cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('woodmaps-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    setCartItems((prevItems) => {
      // Generate unique cart item ID
      const cartItemId = `${item.id}-${item.size}-${item.color}`;
      
      // Check if item with same id, size, and color already exists
      const existingItem = prevItems.find((i) => {
        const existingCartItemId = `${i.id}-${i.size}-${i.color}`;
        return existingCartItemId === cartItemId;
      });
      
      if (existingItem) {
        // Update quantity of existing item
        return prevItems.map((i) => {
          const iCartItemId = `${i.id}-${i.size}-${i.color}`;
          return iCartItemId === cartItemId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i;
        });
      }
      
      // Add new item with cartItemId
      return [...prevItems, { ...item, cartItemId }];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems((prevItems) => 
      prevItems.filter((item) => {
        const itemCartId = item.cartItemId || `${item.id}-${item.size}-${item.color}`;
        return itemCartId !== cartItemId;
      })
    );
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        const itemCartId = item.cartItemId || `${item.id}-${item.size}-${item.color}`;
        return itemCartId === cartItemId ? { ...item, quantity } : item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
