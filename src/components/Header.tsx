
import React from 'react';
import { ShoppingCart, Store, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/context/StoreContext';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const { getCartItemsCount } = useStore();
  const location = useLocation();
  const cartItemsCount = getCartItemsCount();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center space-x-2">
          <Store className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-primary">FreshMart</span>
        </Link>

        <nav className="flex items-center space-x-4">
          <Link to="/">
            <Button 
              variant={location.pathname === '/' ? 'default' : 'ghost'} 
              size="sm"
              className="animate-fade-in"
            >
              Shop
            </Button>
          </Link>

          <Link to="/cart" className="relative">
            <Button 
              variant={location.pathname === '/cart' ? 'default' : 'ghost'} 
              size="sm"
              className="animate-fade-in"
            >
              <ShoppingCart className="h-4 w-4" />
              {cartItemsCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs animate-scale-in"
                >
                  {cartItemsCount}
                </Badge>
              )}
            </Button>
          </Link>

          <Link to="/admin">
            <Button 
              variant={location.pathname.startsWith('/admin') ? 'default' : 'ghost'} 
              size="sm"
              className="animate-fade-in"
            >
              <Settings className="h-4 w-4" />
              Admin
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
