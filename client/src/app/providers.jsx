import React from 'react';
import { ToastProvider } from '../components/common/Toast.jsx';

export default function Providers({ children }) {
  return <ToastProvider>{children}</ToastProvider>;
}
