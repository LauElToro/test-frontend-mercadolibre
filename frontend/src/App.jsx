import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import AppRoutes from './routes';

const App = () => (
  <HelmetProvider>
    <AppRoutes />
  </HelmetProvider>
);

export default App;
