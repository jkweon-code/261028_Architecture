import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { siteConfig } from './config/site';
import './index.css';

// site.ts 의 설정을 화면에 적용
document.documentElement.style.setProperty('--accent', siteConfig.accentColor);
document.title = siteConfig.name;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
