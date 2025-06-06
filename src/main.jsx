import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { ResidentProvider } from './context/ResidentContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ResidentProvider>
      <App />
    </ResidentProvider>
  </StrictMode>
);
