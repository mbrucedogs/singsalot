import { IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Menu from './components/Menu/Menu';

import Artists from './pages/Artists/Artists';
import Favorites from './pages/Favorites/Favorites';
import History from './pages/History/History';
import LatestSongs from './pages/LatestSongs/LatestSongs';
import Login from './pages/Login/Login';
import Queue from './pages/Queue/Queue';
import Search from './pages/Search/Search';
import Settings from './pages/Settings/Settings';
import Singers from './pages/Singers/Singers';
import SongLists from './pages/SongLists/SongLists';
import { useState } from 'react';
import { useWindowDimensions } from './hooks/useWindowDimensions';

const PrivateRoute = ({ children, isAuthenticated = false, ...rest }) => {
  console.log("debug - isAuthenticated:", isAuthenticated);

  return (    
    <Route {...rest} render={({ location }) => {
      return isAuthenticated === true
        ? children
        : <Redirect to={{
            pathname: '/login',
            state: { from: location }
          }} />
    }} />
  )
};

const Router = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const { width } = useWindowDimensions();
  const showSplitPane = isAuthenticated && width > 700;
  console.log("debug - showSplitPane:", showSplitPane);
  return (
    <IonReactRouter>
        <IonSplitPane contentId="main" when={showSplitPane} >
          <Menu/>
          <IonRouterOutlet id="main" animated="true">
            {/* private */}
            <PrivateRoute path="/" exact={true} isAuthenticated={isAuthenticated}>
              <Queue/>
            </PrivateRoute>

            <PrivateRoute path="/Artists" exact={true} isAuthenticated={isAuthenticated}>
              <Artists/>
            </PrivateRoute>

            <PrivateRoute path="/Favorites" exact={true} isAuthenticated={isAuthenticated}>
              <Favorites/>
            </PrivateRoute>

            <PrivateRoute path="/History" exact={true} isAuthenticated={isAuthenticated}>
              <History/>
            </PrivateRoute>

            <PrivateRoute path="/LatestSongs" exact={true} isAuthenticated={isAuthenticated}>
              <LatestSongs/>
            </PrivateRoute>

            <PrivateRoute path="/Queue" isAuthenticated={isAuthenticated}>
              <Queue/>
            </PrivateRoute>

            <PrivateRoute path="/Search/:query" exact={true} isAuthenticated={isAuthenticated}>
              <Search/>
            </PrivateRoute>

            <PrivateRoute path="/Settings" exact={true} isAuthenticated={isAuthenticated}>
              <Settings/>
            </PrivateRoute>

            <PrivateRoute path="/Singers" exact={true} isAuthenticated={isAuthenticated}>
              <Singers/>
            </PrivateRoute>

            <PrivateRoute path="/SongLists" exact={true} isAuthenticated={isAuthenticated}>
              <SongLists/>
            </PrivateRoute>
            
            {/* public  */}
            <Route path="/Login" component={Login} exact={true}/>

            <Redirect to="/"/>
            
          </IonRouterOutlet>
        </IonSplitPane>
    </IonReactRouter>
  );
};

export default Router;
