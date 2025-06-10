
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/types';

export const useUserOrders = () => {
  return useQuery({
    queryKey: ['user-orders'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*, products(*))')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user orders:', error);
        throw error;
      }

      return data.map(order => ({
        id: order.id,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        customerPhone: order.customer_phone,
        total: Number(order.total),
        status: order.status as 'pending' | 'confirmed' | 'delivered',
        createdAt: new Date(order.created_at),
        items: order.order_items.map((item: any) => ({
          product: {
            id: item.products.id,
            name: item.products.name,
            price: Number(item.products.price),
            image: item.products.image,
            category: item.products.category,
            unit: item.products.unit,
            inStock: item.products.in_stock,
            description: item.products.description,
          },
          quantity: item.quantity,
        })),
      })) as Order[];
    },
  });
};
