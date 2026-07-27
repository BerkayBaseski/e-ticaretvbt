import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { ToastProvider } from './components/ui/Toast';
import { useAuthStore } from './stores/authStore';
import { useCartStore } from './stores/cartStore';
import { AppRoutes } from './routes';

export const App: React.FC = () => {
  const initAuth = useAuthStore((s) => s.initAuth);
  const fetchCart = useCartStore((s) => s.fetchCart);

  useEffect(() => {
    initAuth();
    fetchCart();
  }, [initAuth, fetchCart]);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ToastProvider>
    </QueryClientProvider>
  );
};

export default App;
