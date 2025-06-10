
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { StoreProvider } from "@/context/StoreContext";
import Header from "@/components/Header";
import Shop from "@/pages/Shop";
import Cart from "@/pages/Cart";
import Admin from "@/pages/Admin";
import UserProfile from "@/components/UserProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BrowserRouter>
          <StoreProvider>
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
              {/* Background Pattern */}
              <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
              
              <div className="relative z-10">
                <Header />
                <main className="container mx-auto px-4 py-8">
                  <Toaster />
                  <Sonner />
                  <Routes>
                    <Route path="/" element={<Shop />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </div>
          </StoreProvider>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
