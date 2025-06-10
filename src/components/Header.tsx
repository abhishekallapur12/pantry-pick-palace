
import React, { useState } from 'react';
import { ShoppingCart, Store, Settings, User, LogOut, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/components/auth/AuthProvider';
import { Link, useLocation } from 'react-router-dom';
import LoginModal from '@/components/auth/LoginModal';

const Header = () => {
  const { getCartItemsCount } = useStore();
  const { user, signOut, isAdmin } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const location = useLocation();
  const cartItemsCount = getCartItemsCount();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-primary/10 via-background to-primary/5 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Store className="h-6 w-6 text-primary" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              FreshMart
            </span>
          </Link>

          <nav className="flex items-center space-x-2">
            <Link to="/">
              <Button 
                variant={location.pathname === '/' ? 'default' : 'ghost'} 
                size="sm"
                className="animate-fade-in hover:scale-105 transition-all duration-200"
              >
                <Store className="h-4 w-4 mr-2" />
                Shop
              </Button>
            </Link>

            <Link to="/cart" className="relative">
              <Button 
                variant={location.pathname === '/cart' ? 'default' : 'ghost'} 
                size="sm"
                className="animate-fade-in hover:scale-105 transition-all duration-200"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart
                {cartItemsCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 text-xs animate-pulse shadow-lg"
                  >
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {isAdmin && (
              <Link to="/admin">
                <Button 
                  variant={location.pathname.startsWith('/admin') ? 'default' : 'ghost'} 
                  size="sm"
                  className="animate-fade-in hover:scale-105 transition-all duration-200"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              </Link>
            )}

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="animate-fade-in hover:scale-105 transition-all duration-200">
                    <div className="p-1 rounded-full bg-primary/10">
                      <User className="h-4 w-4" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur-sm border border-border/50 shadow-xl">
                  <DropdownMenuItem disabled className="text-muted-foreground font-medium">
                    {user.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center hover:bg-primary/5 transition-colors">
                      <UserCircle className="h-4 w-4 mr-2 text-primary" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="hover:bg-destructive/5 text-destructive focus:text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowLoginModal(true)}
                className="animate-fade-in hover:scale-105 transition-all duration-200 border-primary/20 hover:border-primary/40"
              >
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            )}
          </nav>
        </div>
      </header>

      <LoginModal 
        open={showLoginModal} 
        onOpenChange={setShowLoginModal} 
      />
    </>
  );
};

export default Header;
