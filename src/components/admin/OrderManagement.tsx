
import React from 'react';
import { Clock, CheckCircle, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStore } from '@/context/StoreContext';
import { Order } from '@/types';
import { useToast } from '@/hooks/use-toast';

const OrderManagement = () => {
  const { orders, updateOrderStatus } = useStore();
  const { toast } = useToast();

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    updateOrderStatus(orderId, newStatus);
    toast({
      title: "Order status updated",
      description: `Order status changed to ${newStatus}`
    });
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'delivered':
        return <Truck className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
    }
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No orders found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Orders</h2>

      <div className="space-y-4">
        {orders.map(order => (
          <Card key={order.id} className="animate-fade-in">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <Badge className={getStatusColor(order.status)}>
                  {getStatusIcon(order.status)}
                  <span className="ml-1 capitalize">{order.status}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm font-medium">Customer</p>
                  <p className="text-sm">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm">{order.customerEmail}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm">{order.customerPhone}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <p className="font-medium mb-2">Items ({order.items.length})</p>
                <div className="space-y-2">
                  {order.items.map(item => (
                    <div key={item.product.id} className="flex justify-between items-center p-2 bg-muted rounded">
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ${item.product.price} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total and Actions */}
              <div className="flex justify-between items-center pt-4 border-t">
                <div>
                  <p className="text-lg font-bold">Total: ${order.total.toFixed(2)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Select 
                    value={order.status} 
                    onValueChange={(value: Order['status']) => handleStatusChange(order.id, value)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OrderManagement;
