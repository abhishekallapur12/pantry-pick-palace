
import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';
import { useStore } from '@/context/StoreContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, cart, updateCartQuantity } = useStore();
  
  const cartItem = cart.find(item => item.product.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleIncrement = () => {
    updateCartQuantity(product.id, quantity + 1);
  };

  const handleDecrement = () => {
    updateCartQuantity(product.id, quantity - 1);
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 animate-fade-in">
      <CardContent className="p-4">
        <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
          <img 
            src={product.image} 
            alt={product.name}
            className="h-16 w-16 object-cover rounded"
          />
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium text-sm line-clamp-2">{product.name}</h3>
          <Badge variant="secondary" className="text-xs">
            {product.category}
          </Badge>
          <p className="text-xs text-muted-foreground">{product.unit}</p>
          <p className="font-bold text-lg text-primary">${product.price}</p>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        {!product.inStock ? (
          <Button disabled className="w-full" variant="secondary">
            Out of Stock
          </Button>
        ) : quantity === 0 ? (
          <Button 
            onClick={handleAddToCart}
            className="w-full animate-scale-in"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        ) : (
          <div className="flex items-center justify-between w-full">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleDecrement}
              className="h-8 w-8 p-0"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="font-medium px-4">{quantity}</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleIncrement}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
