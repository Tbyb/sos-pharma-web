import { Component } from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from './atoms/Button';

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary a intercepté une erreur :', error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gris-clair">
          <div className="max-w-md text-center bg-white rounded-lg shadow-card p-8">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7 text-danger" />
            </div>
            <h1 className="text-xl font-bold text-noir mb-2">Une erreur est survenue</h1>
            <p className="text-sm text-gris mb-6">
              Quelque chose s'est mal passé. Vous pouvez retourner à l'accueil et réessayer.
            </p>
            <Button onClick={this.handleReload}>Retour à l'accueil</Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
