import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { FirebaseProvider } from './FirebaseProvider';
import { PremiumProvider } from './context/PremiumContext';
import { ThemeProvider } from './context/ThemeContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FirebaseProvider>
      <PremiumProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </PremiumProvider>
    </FirebaseProvider>
  </StrictMode>,
);
