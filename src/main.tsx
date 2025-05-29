import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { FilesProvider } from './contexts/FilesContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FilesProvider>
      <App />
    </FilesProvider>
  </StrictMode>
);