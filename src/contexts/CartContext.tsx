import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Product, Variant } from './ProductContext';

export interface CartItem {
  id: string; // Product ID
  cartItemId: string; // Unique ID for this cart entry, e.g., "productid-6ml"
  name: string;
  imageUrl: string;
  quantity: number;
  size: string;
  price: number; // Price for the selected size
}

interface CartState {
  cartItems: CartItem[];
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: { product: Product; variant: Variant; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: { cartItemId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { cartItemId: string; quantity: number } }
  | { type: 'SET_CART'; payload: { cartItems: CartItem[] } }
  | { type: 'CLEAR_CART' };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, variant, quantity } = action.payload;
      const cartItemId = `${product.id}-${variant.size}`;
      const existingItem = state.cartItems.find(item => item.cartItemId === cartItemId);
      
      if (existingItem) {
        return {
          ...state,
          cartItems: state.cartItems.map(item =>
            item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + quantity } : item
          ),
        };
      }
      
      const newItem: CartItem = {
        id: product.id,
        cartItemId,
        name: product.name,
        imageUrl: product.imageUrl,
        quantity,
        size: variant.size,
        price: variant.price,
      };

      return {
        ...state,
        cartItems: [...state.cartItems, newItem],
      };
    }
    case 'REMOVE_FROM_CART': {
      return {
        ...state,
        cartItems: state.cartItems.filter(item => item.cartItemId !== action.payload.cartItemId),
      };
    }
    case 'UPDATE_QUANTITY': {
      return {
        ...state,
        cartItems: state.cartItems.map(item =>
          item.cartItemId === action.payload.cartItemId ? { ...item, quantity: action.payload.quantity } : item
        ).filter(item => item.quantity > 0), // Also remove if quantity is 0
      };
    }
    case 'SET_CART': {
        return {
            ...state,
            cartItems: action.payload.cartItems,
        };
    }
    case 'CLEAR_CART': {
        return {
            ...state,
            cartItems: [],
        };
    }
    default:
      return state;
  }
};

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, variant: Variant, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const initializer = (initialState: CartState): CartState => {
    try {
        const storedCart = localStorage.getItem('darulAttarCart');
        if (storedCart) {
            return { ...initialState, cartItems: JSON.parse(storedCart) };
        }
    } catch (error) {
        console.error("Could not parse cart from localStorage", error);
    }
    return initialState;
}

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { cartItems: [] }, initializer);

  useEffect(() => {
    try {
        localStorage.setItem('darulAttarCart', JSON.stringify(state.cartItems));
    } catch (error) {
        console.error("Could not save cart to localStorage", error);
    }
  }, [state.cartItems]);

  const addToCart = (product: Product, variant: Variant, quantity: number) => {
    dispatch({ type: 'ADD_TO_CART', payload: { product, variant, quantity } });
  };

  const removeFromCart = (cartItemId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { cartItemId } });
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { cartItemId, quantity } });
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const cartCount = state.cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = state.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const value = {
    cartItems: state.cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};