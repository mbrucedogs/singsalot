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
import FirebaseService from './services/FirebaseService';
import { useAppDispatch } from './hooks/hooks'
import authenticated, { authenticatedChange } from './store/slices/authenticated';
import { useSelector } from 'react-redux';
import { selectAuthenticated } from './store/store';

export const PrivateRoutes:React.FC = () => { 
  return (
    <IonSplitPane contentId="main">
      <Menu/>
      <IonRouterOutlet id="main" animated={true}>
          <Route path="/" component={Queue} exact={true}/>
          <Route path="/Artists" exact={true} component={Artists}/>
          <Route path="/Favorites" exact={true} component={Favorites}/>
          <Route path="/History" exact={true} component={History}/>
          <Route path="/LatestSongs" exact={true} component={LatestSongs}/>
          <Route path="/Queue" component={Queue}/>
          <Route path="/Search/:query" exact={true} component={Search}/>
          <Route path="/Settings" exact={true} component={Settings}/>
          <Route path="/Singers" exact={true} component={Singers}/>
          <Route path="/SongLists" exact={true} component={SongLists}/>
          <Redirect to="/"/>
      </IonRouterOutlet>
    </IonSplitPane>
  );
}

interface AuthCheckProps {
  isAuthenticated:boolean;
  secured: React.ReactNode; 
  children: React.ReactNode;
}

export const AuthCheck:React.FC<AuthCheckProps> = ({isAuthenticated, secured, children}) => {
  if (isAuthenticated) {
    return <>{secured}</>
  } else {
    return <>{children}</>;
  }
}

const Router: React.FC = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useSelector(selectAuthenticated);

  const onLogin = (controllerId: string, singerName: string):Promise<boolean> =>{
    return new Promise(function(resolve, reject) {
      let success: boolean = false;
      let promise = FirebaseService.controllerExists(controllerId);
      promise.then(snapshot => {
        if (snapshot.exists()) {
          success = true;
        }
        resolve(success);
        if(success){
          dispatch(authenticatedChange(true));
        }
      })
    }); 
  }
  
  return (
    <IonReactRouter>
       <AuthCheck isAuthenticated={isAuthenticated} secured={<PrivateRoutes/>}>
          <IonRouterOutlet id="main">
            <Route path="/Login" exact={true}>
              <Login onLogin={onLogin} />
            </Route>
            <Redirect to="/login"/>
          </IonRouterOutlet>
       </AuthCheck>
    </IonReactRouter>
  );
};

export default Router;
