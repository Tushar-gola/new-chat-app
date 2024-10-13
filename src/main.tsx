import { createRoot } from 'react-dom/client'
import App from './App.tsx'
// Supports weights 100-900
import '@fontsource-variable/montserrat';
createRoot(document.getElementById('root')!).render(
    <App />
)
