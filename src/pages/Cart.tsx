
import React, { useState } from 'react';
import { Minus, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/components/auth/AuthProvider';
import { useCreateOrder } from '@/hooks/useOrders';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cart, updateCartQuantity, removeFromCart, getCartTotal, clearCart } = useStore();
  const { user } = useAuth();
  const createOrderMutation = useCreateOrder();
  const { toast } = useToast();
  
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: user?.email || '',
    phone: '',
  });

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const total = getCartTotal();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 0) return;
    console.log('Changing quantity for:', productId, 'to:', newQuantity);
    updateCartQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: string) => {
    console.log('Removing item:', productId);
    removeFromCart(productId);
    toast({
      title: "Item Removed",
      description: "Item has been removed from your cart.",
    });
  };

  const handlePlaceOrder = async () => {
    console.log('Placing order...');
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to place an order.",
        variant: "destructive",
      });
      return;
    }

    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Add some items to your cart before placing an order.",
        variant: "destructive",
      });
      return;
    }

    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all customer information fields.",
        variant: "destructive",
      });
      return;
    }

    setIsPlacingOrder(true);

    try {
      console.log('Creating order with data:', {
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        items: cart,
        total,
      });

      await createOrderMutation.mutateAsync({
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        items: cart,
        total,
      });
      
      clearCart();
      setCustomerInfo({ name: '', email: user?.email || '', phone: '' });
      
      toast({
        title: "Order Placed Successfully!",
        description: `Your order for $${total.toFixed(2)} has been placed.`,
      });
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Order Failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-6">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link to="/">
            <Button size="lg" className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shop
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Shopping Cart ({cart.length} items)</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <Card key={item.product.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-lg truncate">{item.product.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.product.category}</p>
                    <p className="font-bold text-primary text-lg">${item.product.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">${(item.product.price * item.quantity).toFixed(2)}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.product.id)}
                      className="text-destructive hover:text-destructive mt-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="truncate pr-2">{item.product.name} × {item.quantity}</span>
                    <span className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <hr className="my-2" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handlePlaceOrder} 
                className="w-full"
                disabled={isPlacingOrder || createOrderMutation.isPending}
                size="lg"
              >
                {isPlacingOrder || createOrderMutation.isPending ? 'Placing Order...' : `Place Order - $${total.toFixed(2)}`}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;
