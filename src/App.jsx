import { Toaster } from 'react-hot-toast';
import AppRouter from './router/AppRouter';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <AppRouter />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { fontSize: '14px' },
          success: { iconTheme: { primary: '#16A34A', secondary: '#fff' } },
          error: { iconTheme: { primary: '#DC2626', secondary: '#fff' } },
        }}
      />
    </ErrorBoundary>
  );
}
