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
import FirebaseService from './services/FirebaseService';
import { useAppDispatch } from './hooks/hooks'
import { authenticatedChange } from './store/slices/authenticated';
import { useSelector } from 'react-redux';
import { selectAuthenticated } from './store/store';
import { ISongListSong, ISong, IArtist} from './services/models';
import FirebaseReduxHandler from './components/FirebaseReduxHandler';

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
  const dispatch = useAppDispatch();
  const isAuthenticated = useSelector(selectAuthenticated);

  const onLogin = (controllerId: string, singerName: string): Promise<boolean> => {
    return new Promise(function (resolve, reject) {
      let success: boolean = false;
      let promise = FirebaseService.controllerExists(controllerId);
      promise.then(snapshot => {
        if (snapshot.exists()) {
          success = true;
        }
        resolve(success);
        if (success) {
          dispatch(authenticatedChange(true));
        }
      })
    });
  }

  const onArtistPick = (artist: IArtist) => {
    console.log("onArtistPick - artist", artist);
  }

  const onSongPick = (song: ISong) => {
    console.log("onSongPick - songListSong", song);
  }

  const onSongListSongPick = (song: ISongListSong) => {
    console.log("onSongListSongPick - songListSong", song);
  }

  return (
    <IonReactRouter>
      <AuthCheck isAuthenticated={isAuthenticated} fallback={<Login onLogin={onLogin} />}>
        <IonSplitPane contentId="main">
          <Menu />
          <IonRouterOutlet id="main" animated={true}>
            <Route path="/" component={Queue} exact={true} />
            <Route path="/Artists" exact={true}>
              <Artists onArtistPick={onArtistPick} />
            </Route>
            <Route path="/Favorites" exact={true}>
              <Favorites onSongPick={onSongPick} />
            </Route>
            <Route path="/History" exact={true}>
              <History onSongPick={onSongPick} />
            </Route>
            <Route path="/LatestSongs" exact={true}>
              <LatestSongs onSongPick={onSongPick} />
            </Route>
            <Route path="/Queue" component={Queue} />
            <Route path="/Search/:query" exact={true}>
              <Search onSongPick={onSongPick} />
            </Route>
            <Route path="/Settings" exact={true} component={Settings} />
            <Route path="/Singers" exact={true} component={Singers} />
            <Route path="/SongLists" exact={true}>
              <SongLists onSongListSongPick={onSongListSongPick} />
            </Route>
            <Redirect to="/" />
          </IonRouterOutlet>
        </IonSplitPane>
      </AuthCheck>
    </IonReactRouter>
  );
};

export default Router;
