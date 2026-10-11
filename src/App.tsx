import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRoutes } from './routes';
import { socketService } from './services/websocket/socketService';
import { useAuthStore } from './store/useAuthStore';
import { useThemeStore } from './store/useThemeStore';

// Configure TanStack Query Client with optimal caching & refetch strategies
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const { checkAuth, logout } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    // Synchronize HTML dark/light theme class
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Initialize Socket.IO connection and event bus
    socketService.init();

    // Check JWT session
    checkAuth();

    // Handle global auth expiration event triggered by 401 interceptor
    const handleAuthExpired = () => {
      logout();
      window.location.href = '/login';
    };
    window.addEventListener('auth:expired', handleAuthExpired);

    return () => {
      window.removeEventListener('auth:expired', handleAuthExpired);
      socketService.disconnect();
    };
  }, [theme, checkAuth, logout]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
