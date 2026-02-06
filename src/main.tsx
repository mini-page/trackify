import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// GitHub Pages SPA fallback: convert ?path=... back into a real path.
const params = new URLSearchParams(window.location.search);
const redirectPath = params.get('path');
if (redirectPath) {
  window.history.replaceState({}, '', redirectPath);
}

createRoot(document.getElementById("root")!).render(<App />);
