
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
  | { type: 'LOAD_CART' }
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'CLEAR_CART' };

const CART_STORAGE_KEY = 'freshmart_cart';

const loadCartFromStorage = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading cart from storage:', error);
    return [];
  }
};

const saveCartToStorage = (cart: CartItem[]) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to storage:', error);
  }
};

const initialState: StoreState = {
  products: [],
  cart: loadCartFromStorage(),
  orders: [],
};

const storeReducer = (state: StoreState, action: StoreAction): StoreState => {
  let newState: StoreState;
  
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'SET_ORDERS':
      return { ...state, orders: action.payload };
    case 'LOAD_CART':
      return { ...state, cart: loadCartFromStorage() };
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.product.id === action.payload.id);
      if (existingItem) {
        newState = {
          ...state,
          cart: state.cart.map(item =>
            item.product.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      } else {
        newState = {
          ...state,
          cart: [...state.cart, { product: action.payload, quantity: 1 }],
        };
      }
      saveCartToStorage(newState.cart);
      return newState;
    case 'UPDATE_CART_QUANTITY':
      if (action.payload.quantity <= 0) {
        newState = {
          ...state,
          cart: state.cart.filter(item => item.product.id !== action.payload.productId),
        };
      } else {
        newState = {
          ...state,
          cart: state.cart.map(item =>
            item.product.id === action.payload.productId
              ? { ...item, quantity: action.payload.quantity }
              : item
          ),
        };
      }
      saveCartToStorage(newState.cart);
      return newState;
    case 'REMOVE_FROM_CART':
      newState = {
        ...state,
        cart: state.cart.filter(item => item.product.id !== action.payload),
      };
      saveCartToStorage(newState.cart);
      return newState;
    case 'CLEAR_CART':
      newState = { ...state, cart: [] };
      saveCartToStorage(newState.cart);
      return newState;
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

  // Load cart from storage on mount
  useEffect(() => {
    dispatch({ type: 'LOAD_CART' });
  }, []);

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
    console.log('Adding to cart:', product);
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    console.log('Updating cart quantity:', productId, quantity);
    dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { productId, quantity } });
  };

  const removeFromCart = (productId: string) => {
    console.log('Removing from cart:', productId);
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const clearCart = () => {
    console.log('Clearing cart');
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCartTotal = () => {
    const total = state.cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
    console.log('Cart total:', total);
    return total;
  };

  const getCartItemsCount = () => {
    const count = state.cart.reduce((count, item) => count + item.quantity, 0);
    console.log('Cart items count:', count);
    return count;
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    console.log('Adding product:', product);
    createProductMutation.mutate(product);
  };

  const updateProduct = (id: string, product: Partial<Product>) => {
    console.log('Updating product:', id, product);
    updateProductMutation.mutate({ id, ...product } as Product);
  };

  const deleteProduct = (id: string) => {
    console.log('Deleting product:', id);
    deleteProductMutation.mutate(id);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    console.log('Updating order status:', orderId, status);
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

  console.log('Store state:', { cartLength: state.cart.length, productsLength: state.products.length });

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};
