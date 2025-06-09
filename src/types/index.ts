
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  unit: string;
  inStock: boolean;
  quantity: number;
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

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  use_current_location?: boolean;
}
