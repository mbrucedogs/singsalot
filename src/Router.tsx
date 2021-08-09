import { IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route, useHistory } from 'react-router-dom';
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
import { Song } from "./models/Song";
import FirebaseReduxHandler from './components/FirebaseReduxHandler';
import { useCallback } from 'react';
import { useSingers } from './hooks/useSingers';
import { useAuthentication } from './hooks/useAuthentication';
import { useQueue } from './hooks/useQueue';

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
  const { setSelectedInfoSong, setSelectedSong } = useQueue();
  const { addSinger } = useSingers();
  const { authenticated, login } = useAuthentication();

  const onLogin = (controllerId: string, singerName: string): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
      login(controllerId, singerName).then(res => {
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
            <Route path="/Artists" exact={true}>
              <Artists />
            </Route>
            <Route path="/Favorites" exact={true}>
              <Favorites />
            </Route>
            <Route path="/History" exact={true}>
              <History />
            </Route>
            <Route path="/LatestSongs" exact={true}>
              <LatestSongs />
            </Route>
            <Route path="/Queue">
              <Queue />
            </Route>
            <Route path="/Search">
              <Search />
            </Route>
            <Route path="/Settings" exact={true} component={Settings} />
            <Route path="/Singers" exact={true} component={Singers} />
            <Route path="/SongLists" exact={true}>
              <SongLists />
            </Route>
            <Route path="/TopPlayed" exact={true}>
              <TopSongs />
            </Route>
            <Route path="/SingerPick" exact={true} component={SingerPick} />
            <Redirect to="/" />
          </IonRouterOutlet>
        </IonSplitPane>
      </AuthCheck>
    </IonReactRouter>
  );
};

export default Router;
