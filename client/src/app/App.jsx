import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router.jsx';
import Providers from './providers.jsx';
import '../styles/globals.css';

export default function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
}
