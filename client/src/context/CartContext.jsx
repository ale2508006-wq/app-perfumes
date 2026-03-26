import { createContext, useEffect, useState } from "react";
import {
  addToCartApi,
  clearCartApi,
  getCartApi,
  removeCartItemApi,
  updateCartItemApi,
} from "../api/cartApi";
import { useAuth } from "../hooks/useAuth";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const { token, isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [], subtotal: 0, total: 0 });
  const [loadingCart, setLoadingCart] = useState(false);

  const loadCart = async () => {
    if (!isAuthenticated || !token) return;

    setLoadingCart(true);
    try {
      const response = await getCartApi(token);
      setCart(response.data);
    } finally {
      setLoadingCart(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    const response = await addToCartApi(token, productId, quantity);
    setCart(response.data);
  };

  const updateItem = async (productId, quantity) => {
    const response = await updateCartItemApi(token, productId, quantity);
    setCart(response.data);
  };

  const removeItem = async (productId) => {
    const response = await removeCartItemApi(token, productId);
    setCart(response.data);
  };

  const clearCart = async () => {
    const response = await clearCartApi(token);
    setCart(response.data);
  };

  useEffect(() => {
    if (isAuthenticated && token) {
      loadCart();
    } else {
      setCart({ items: [], subtotal: 0, total: 0 });
    }
  }, [isAuthenticated, token]);

  return (
    <CartContext.Provider
      value={{
        cart,
        loadingCart,
        loadCart,
        addToCart,
        updateItem,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
