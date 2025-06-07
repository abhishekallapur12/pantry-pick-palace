
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order } from '@/types';

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (customerInfo: { name: string; email: string; phone: string }) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Fresh Bananas',
    price: 2.99,
    image: '/placeholder.svg',
    category: 'Fruits',
    unit: 'per kg',
    inStock: true,
    description: 'Fresh organic bananas'
  },
  {
    id: '2',
    name: 'Whole Milk',
    price: 3.49,
    image: '/placeholder.svg',
    category: 'Dairy',
    unit: 'per liter',
    inStock: true,
    description: 'Fresh whole milk'
  },
  {
    id: '3',
    name: 'Brown Bread',
    price: 2.25,
    image: '/placeholder.svg',
    category: 'Bakery',
    unit: 'per loaf',
    inStock: true,
    description: 'Whole grain brown bread'
  },
  {
    id: '4',
    name: 'Fresh Tomatoes',
    price: 4.50,
    image: '/placeholder.svg',
    category: 'Vegetables',
    unit: 'per kg',
    inStock: true,
    description: 'Fresh red tomatoes'
  },
  {
    id: '5',
    name: 'Greek Yogurt',
    price: 5.99,
    image: '/placeholder.svg',
    category: 'Dairy',
    unit: 'per pack',
    inStock: true,
    description: 'Creamy Greek yogurt'
  },
  {
    id: '6',
    name: 'Fresh Apples',
    price: 3.99,
    image: '/placeholder.svg',
    category: 'Fruits',
    unit: 'per kg',
    inStock: true,
    description: 'Crisp red apples'
  }
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedProducts = localStorage.getItem('grocery-products');
    const savedCart = localStorage.getItem('grocery-cart');
    const savedOrders = localStorage.getItem('grocery-orders');

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('grocery-products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('grocery-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('grocery-orders', JSON.stringify(orders));
  }, [orders]);

  const addProduct = (product: Product) => {
    setProducts([...products, { ...product, id: Date.now().toString() }]);
  };

  const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updatedProduct } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    setCart(cart.filter(item => item.product.id !== id));
  };

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    if (existingItem) {
      updateCartQuantity(product.id, existingItem.quantity + 1);
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => 
        item.product.id === productId 
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const placeOrder = (customerInfo: { name: string; email: string; phone: string }) => {
    const newOrder: Order = {
      id: Date.now().toString(),
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      customerPhone: customerInfo.phone,
      items: [...cart],
      total: getCartTotal(),
      status: 'pending',
      createdAt: new Date()
    };
    setOrders([newOrder, ...orders]);
    clearCart();
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <StoreContext.Provider value={{
      products,
      cart,
      orders,
      addProduct,
      updateProduct,
      deleteProduct,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      placeOrder,
      updateOrderStatus,
      getCartTotal,
      getCartItemsCount
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
