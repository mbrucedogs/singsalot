import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { setupIonicReact } from '@ionic/react'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux';
import { store } from './redux/store';

// Initialize Ionic React
setupIonicReact();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
