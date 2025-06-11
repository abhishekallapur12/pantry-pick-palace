
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Order, CartItem } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*, products(*))')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
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
            quantity: item.products.quantity,
            description: item.products.description,
          },
          quantity: item.quantity,
        })),
      })) as Order[];
    },
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (orderData: {
      customerName: string;
      customerEmail: string;
      customerPhone: string;
      items: CartItem[];
      total: number;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check if all products have sufficient stock
      for (const item of orderData.items) {
        const { data: product, error } = await supabase
          .from('products')
          .select('quantity, name')
          .eq('id', item.product.id)
          .single();

        if (error) throw new Error(`Error checking stock for ${item.product.name}`);
        
        if (product.quantity < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}. Available: ${product.quantity}, Requested: ${item.quantity}`);
        }
      }

      // Create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          customer_name: orderData.customerName,
          customer_email: orderData.customerEmail,
          customer_phone: orderData.customerPhone,
          total: orderData.total,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items and update product quantities
      for (const item of orderData.items) {
        // Insert order item
        const { error: itemError } = await supabase
          .from('order_items')
          .insert({
            order_id: order.id,
            product_id: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
          });

        if (itemError) throw itemError;

        // Update product quantity - get current quantity first, then update
        const { data: currentProduct } = await supabase
          .from('products')
          .select('quantity')
          .eq('id', item.product.id)
          .single();

        if (currentProduct) {
          const newQuantity = currentProduct.quantity - item.quantity;
          const { error: updateError } = await supabase
            .from('products')
            .update({ 
              quantity: newQuantity,
              in_stock: newQuantity > 0
            })
            .eq('id', item.product.id);

          if (updateError) throw updateError;
        }
      }

      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Order placed successfully!",
        description: "Your order has been submitted and product quantities have been updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error placing order",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Order['status'] }) => {
      const { data, error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: "Success!",
        description: "Order status updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
