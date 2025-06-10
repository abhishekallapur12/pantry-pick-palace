
import React from 'react';
import { Package, Clock, CheckCircle, Truck, Calendar, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useUserOrders } from '@/hooks/useUserOrders';
import { Order } from '@/types';

const OrderHistory = () => {
  const { data: orders, isLoading, error } = useUserOrders();

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'delivered':
        return <Truck className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <Card className="shadow-lg border-0 bg-gradient-to-br from-background to-muted/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-lg bg-primary/10">
              <Package className="h-6 w-6 text-primary" />
            </div>
            Order History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-muted-foreground ml-3">Loading your orders...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-lg border-0 bg-gradient-to-br from-background to-destructive/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-lg bg-destructive/10">
              <Package className="h-6 w-6 text-destructive" />
            </div>
            Order History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-destructive font-medium">Unable to load order history</p>
            <p className="text-muted-foreground text-sm mt-1">Please try refreshing the page</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Card className="shadow-lg border-0 bg-gradient-to-br from-background to-muted/10">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-lg bg-primary/10">
              <Package className="h-6 w-6 text-primary" />
            </div>
            Order History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="p-4 rounded-full bg-muted/50 inline-block mb-4">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">No orders yet</p>
            <p className="text-muted-foreground/70 text-sm mt-1">Start shopping to see your orders here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-background to-muted/10">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 rounded-lg bg-primary/10">
            <Package className="h-6 w-6 text-primary" />
          </div>
          Order History
          <Badge variant="secondary" className="ml-auto">
            {orders.length} {orders.length === 1 ? 'order' : 'orders'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {orders.map((order, index) => (
          <div key={order.id} className="border rounded-xl p-5 space-y-4 bg-card hover:shadow-md transition-all duration-200 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-lg">Order #{order.id.slice(0, 8)}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {order.createdAt.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
              <Badge className={`${getStatusColor(order.status)} border font-medium px-3 py-1`}>
                {getStatusIcon(order.status)}
                <span className="ml-2 capitalize">{order.status}</span>
              </Badge>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Items Ordered</h4>
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 px-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span className="font-medium">{item.product.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{item.quantity} × ${item.product.price}</div>
                    <div className="text-sm text-muted-foreground">${(item.quantity * item.product.price).toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center pt-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span className="font-medium">Total Amount</span>
              </div>
              <span className="text-xl font-bold text-primary">${order.total.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default OrderHistory;
