
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  unit: string;
  inStock: boolean;
  description?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'delivered';
  createdAt: Date;
}
