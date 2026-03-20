import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { FirebaseProvider } from './FirebaseProvider';
import { PremiumProvider } from './context/PremiumContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FirebaseProvider>
      <PremiumProvider>
        <App />
      </PremiumProvider>
    </FirebaseProvider>
  </StrictMode>,
);
