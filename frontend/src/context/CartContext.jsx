import { createContext, useContext, useState, useEffect } from "react";
import { getProductById } from "../api/productApi";
import toast from "react-hot-toast";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart") || "[]");
    } catch {
      return [];
    }
  });
  const [cartLoading, setCartLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  // Main function to add items — supports both ID and full object
  const addItem = async (productOrId, qty = 1, options = {}) => {
    setCartLoading(true);
    try {
      let product;
      
      // If only ID is passed, fetch product details
      if (typeof productOrId === "string") {
        const res = await getProductById(productOrId);
        product = res.data.product || res.data.data;
      } else {
        product = productOrId;
      }

      if (!product) throw new Error("Product not found");

      setItems((prev) => {
        const key = `${product._id}-${JSON.stringify(options)}`;
        const existing = prev.find((i) => i.key === key);
        
        if (existing) {
          return prev.map((i) =>
            i.key === key ? { ...i, qty: i.qty + qty } : i
          );
        }
        
        return [...prev, { key, product, qty, options }];
      });
      
      toast.success(`${product.name} added to cart`);
    } catch (error) {
      console.error("Cart Add Error:", error);
      toast.error("Failed to add to cart");
    } finally {
      setCartLoading(false);
    }
  };

  const removeFromCart = (key) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
    toast.success("Item removed");
  };

  const updateQty = (key, qty) => {
    if (qty < 1) return removeFromCart(key);
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, qty } : i)));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((s, i) => s + i.qty, 0);
  const totalPrice = items.reduce(
    (s, i) => s + (i.product?.price || 0) * i.qty,
    0
  );

  return (
    <CartContext.Provider
      value={{ 
        items, 
        addItem, 
        cartLoading, 
        removeFromCart, 
        updateQty, 
        clearCart, 
        totalItems, 
        cartCount: totalItems,
        totalPrice 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};