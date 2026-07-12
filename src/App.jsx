import { Toaster } from 'react-hot-toast';
import AppRouter from './router/AppRouter';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <AppRouter />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            fontSize: '15px',
            padding: '14px 18px',
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            maxWidth: '420px',
          },
          success: { iconTheme: { primary: '#16A34A', secondary: '#fff' }, style: { border: '1px solid #16A34A' } },
          error: { iconTheme: { primary: '#DC2626', secondary: '#fff' }, style: { border: '1px solid #DC2626' } },
        }}
      />
    </ErrorBoundary>
  );
}
