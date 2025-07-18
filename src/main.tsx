import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { setupIonicReact } from '@ionic/react'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux';
import { store } from './redux/store';

// Initialize Ionic React with dark mode support
setupIonicReact({
  mode: 'ios', // Use iOS mode for consistent styling
  innerHTMLTemplatesEnabled: true,
  // Enable automatic dark mode detection
  _forceStatusbarPadding: false,
  // Enable dark mode
  animated: true,
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
