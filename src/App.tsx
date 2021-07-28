import { IonApp } from '@ionic/react';
import Router from './Router';
import { useEffect } from 'react';
import { selectAuthenticated } from './store/store'
import { useSelector } from 'react-redux'
import FirebaseService from "./services/FirebaseService";

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/style.css';
import './theme/variables.css';
import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
  return (
    <IonApp>
      <ErrorBoundary>
        <Router />
      </ErrorBoundary>
    </IonApp>
  );
};

export default App;
