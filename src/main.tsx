import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';
import { ErrorBoundary } from './ErrorBoundary';
import { validateCatalog } from './converters';
import { registerSW } from 'virtual:pwa-register';

validateCatalog();
registerSW({ immediate: true });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
