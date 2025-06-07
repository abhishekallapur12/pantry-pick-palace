
import React, { useState } from 'react';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useStore } from '@/context/StoreContext';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cart, updateCartQuantity, removeFromCart, getCartTotal, placeOrder } = useStore();
  const { toast } = useToast();
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateCartQuantity(productId, newQuantity);
  };

  const handleRemoveFromCart = (productId: string) => {
    removeFromCart(productId);
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart"
    });
  };

  const handlePlaceOrder = async () => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      toast({
        title: "Missing information",
        description: "Please fill in all customer details",
        variant: "destructive"
      });
      return;
    }

    setIsPlacingOrder(true);
    
    try {
      placeOrder(customerInfo);
      toast({
        title: "Order placed successfully!",
        description: "Your order has been received and will be processed soon."
      });
      setCustomerInfo({ name: '', email: '', phone: '' });
    } catch (error) {
      toast({
        title: "Error placing order",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center animate-fade-in">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Add some products to get started!</p>
          <Link to="/">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 animate-fade-in">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => (
            <Card key={item.product.id} className="animate-fade-in">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name}
                      className="h-12 w-12 object-cover rounded"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.product.unit}</p>
                    <p className="font-bold text-primary">${item.product.price}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="font-medium w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFromCart(item.product.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>$2.99</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${(getCartTotal() + 2.99).toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  placeholder="Enter your phone number"
                />
              </div>
              <Button 
                onClick={handlePlaceOrder} 
                className="w-full"
                disabled={isPlacingOrder}
              >
                {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;
