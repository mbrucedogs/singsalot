import { IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Artists from './pages/Artists';
import Favorites from './pages/Favorites';
import History from './pages/History';
import LatestSongs from './pages/LatestSongs';
import Login from './pages/Login';
import Queue from './pages/Queue';
import Search from './pages/Search';
import Settings from './pages/Settings';
import Singers from './pages/Singers';
import SongLists from './pages/SongLists';
import TopSongs from './pages/TopPlayed';
import SingerPick from './pages/SingerPick'
import FirebaseReduxHandler from './components/FirebaseReduxHandler';
import { useSingers } from './hooks/useSingers';
import { useAuthentication } from './hooks/useAuthentication';

interface AuthCheckProps {
  isAuthenticated: boolean;
  fallback: React.ReactNode;
  children: React.ReactNode;
}

export const AuthCheck: React.FC<AuthCheckProps> = ({ isAuthenticated, fallback, children }) => {
  if (isAuthenticated) {
    return <FirebaseReduxHandler isAuthenticated={isAuthenticated}>
      {children}
    </FirebaseReduxHandler>
  } else {
    return <>{fallback}</>;
  }
}

const Router: React.FC = () => {
  const { addSinger } = useSingers();
  const { authenticated, login } = useAuthentication();
  
  const onLogin = (isAdmin: boolean, controllerId: string, singerName: string): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
      login(isAdmin, controllerId, singerName).then(res => {
        if (res) {
          addSinger(singerName)
            .then(res => resolve(res))
        } else {
          resolve(res);
        }
      })
    });
  }

  return (
    <IonReactRouter>
      <AuthCheck isAuthenticated={authenticated} fallback={<Login onLogin={onLogin} />}>
        <IonSplitPane contentId="main">
          <Menu />
          <IonRouterOutlet id="main" animated={true}>
            <Route path="/" component={Queue} exact={true} />
            <Route path="/Artists" exact={true} component={Artists}/>
            <Route path="/Favorites" exact={true} component={Favorites}/>
            <Route path="/History" exact={true} component={History}/>
            <Route path="/LatestSongs" exact={true} component={LatestSongs}/>
            <Route path="/Queue" component={Queue}/>
            <Route path="/Search" component={Search}/>
            <Route path="/Settings" exact={true} component={Settings} />
            <Route path="/Singers" exact={true} component={Singers} />
            <Route path="/SongLists" exact={true} component={SongLists}/>
            <Route path="/TopPlayed" exact={true} component={TopSongs}/>
            <Route path="/SingerPick" exact={true} component={SingerPick} />
            <Redirect to="/" />
          </IonRouterOutlet>
        </IonSplitPane>
      </AuthCheck>
    </IonReactRouter>
  );
};

export default Router;
