
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Product, CartItem, Order } from '@/types';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useProducts';
import { useOrders, useUpdateOrder } from '@/hooks/useOrders';

interface StoreState {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
}

type StoreAction =
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'CLEAR_CART' };

const initialState: StoreState = {
  products: [],
  cart: [],
  orders: [],
};

const storeReducer = (state: StoreState, action: StoreAction): StoreState => {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'SET_ORDERS':
      return { ...state, orders: action.payload };
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.product.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.product.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, { product: action.payload, quantity: 1 }],
      };
    case 'UPDATE_CART_QUANTITY':
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          cart: state.cart.filter(item => item.product.id !== action.payload.productId),
        };
      }
      return {
        ...state,
        cart: state.cart.map(item =>
          item.product.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.product.id !== action.payload),
      };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    default:
      return state;
  }
};

interface StoreContextType extends StoreState {
  addToCart: (product: Product) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(storeReducer, initialState);
  const { data: products } = useProducts();
  const { data: orders } = useOrders();
  
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();
  const updateOrderMutation = useUpdateOrder();

  useEffect(() => {
    if (products) {
      dispatch({ type: 'SET_PRODUCTS', payload: products });
    }
  }, [products]);

  useEffect(() => {
    if (orders) {
      dispatch({ type: 'SET_ORDERS', payload: orders });
    }
  }, [orders]);

  const addToCart = (product: Product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { productId, quantity } });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCartTotal = () => {
    return state.cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const getCartItemsCount = () => {
    return state.cart.reduce((count, item) => count + item.quantity, 0);
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    createProductMutation.mutate(product);
  };

  const updateProduct = (id: string, product: Partial<Product>) => {
    updateProductMutation.mutate({ id, ...product } as Product);
  };

  const deleteProduct = (id: string) => {
    deleteProductMutation.mutate(id);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    updateOrderMutation.mutate({ id: orderId, status });
  };

  const value = {
    ...state,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};
