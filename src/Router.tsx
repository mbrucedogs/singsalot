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
import FirebaseService from './services/FirebaseService';
import { authenticatedChange } from './store/slices/authenticated';
import { useSelector } from 'react-redux';
import { selectAuthenticated } from './store/store';
import { Song } from "./models/Song";
import FirebaseReduxHandler from './components/FirebaseReduxHandler';
import { useCallback, useState } from 'react';
import { useSingers } from './hooks/useSingers';
import SongPickHandler from './components/SongPickHandler';
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
  const [selectedSong, setSelectedSong] = useState<Song | undefined>();
  const [selectedSongInfo, setSelectedSongInfo] = useState<Song | undefined>();
  const { authenticated, login} = useAuthentication();

  const onLogin = (controllerId: string, singerName: string): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        login(controllerId, singerName).then( res => {
          if (res) {
            addSinger(singerName)
            .then(res => resolve(res))
          } else{
            resolve(res);
          }
        })
    });
  }

  const onSongPickComplete = useCallback(() => {
    setSelectedSong(undefined);
  }, []);

  const onSongInfoComplete = useCallback(() => {
    setSelectedSongInfo(undefined);
  }, []);

  const onSongPick = useCallback((song: Song) => {
    setSelectedSong(song);
  }, []);

  const onSongInfo = useCallback((song: Song) => {
    setSelectedSongInfo(song);
  }, []);

  return (
    <IonReactRouter>
      <AuthCheck isAuthenticated={authenticated} fallback={<Login onLogin={onLogin} />}>
        <IonSplitPane contentId="main">
          <Menu />
          <IonRouterOutlet id="main" animated={true}>
            <Route path="/" component={Queue} exact={true} />
            <Route path="/Artists" exact={true}>
              <SongPickHandler 
              onSongInfoComplete={onSongInfoComplete} 
              onSongPickComplete={onSongPickComplete} 
              selectedSongInfo={selectedSongInfo} 
              selectedSong={selectedSong}>
                <Artists onSongPick={onSongPick} onSongInfo={onSongInfo} />
              </SongPickHandler>
            </Route>
            <Route path="/Favorites" exact={true}>
            <SongPickHandler 
              onSongInfoComplete={onSongInfoComplete} 
              onSongPickComplete={onSongPickComplete} 
              selectedSongInfo={selectedSongInfo} 
              selectedSong={selectedSong}>             
                 <Favorites onSongPick={onSongPick} onSongInfo={onSongInfo} />
              </SongPickHandler>
            </Route>
            <Route path="/History" exact={true}>
            <SongPickHandler 
              onSongInfoComplete={onSongInfoComplete} 
              onSongPickComplete={onSongPickComplete} 
              selectedSongInfo={selectedSongInfo} 
              selectedSong={selectedSong}>
                <History onSongPick={onSongPick} onSongInfo={onSongInfo} />
              </SongPickHandler>
            </Route>
            <Route path="/LatestSongs" exact={true}>
             <SongPickHandler 
              onSongInfoComplete={onSongInfoComplete} 
              onSongPickComplete={onSongPickComplete} 
              selectedSongInfo={selectedSongInfo} 
              selectedSong={selectedSong}><LatestSongs onSongPick={onSongPick} onSongInfo={onSongInfo} />
              </SongPickHandler>
            </Route>
            <Route path="/Queue">
              <Queue />
            </Route>
            <Route path="/Search">
            <SongPickHandler 
              onSongInfoComplete={onSongInfoComplete} 
              onSongPickComplete={onSongPickComplete} 
              selectedSongInfo={selectedSongInfo} 
              selectedSong={selectedSong}>
                <Search onSongPick={onSongPick} onSongInfo={onSongInfo} />
              </SongPickHandler>
            </Route>
            <Route path="/Settings" exact={true} component={Settings} />
            <Route path="/Singers" exact={true} component={Singers} />
            <Route path="/SongLists" exact={true}>
            <SongPickHandler 
              onSongInfoComplete={onSongInfoComplete} 
              onSongPickComplete={onSongPickComplete} 
              selectedSongInfo={selectedSongInfo} 
              selectedSong={selectedSong}>
                <SongLists onSongPick={onSongPick} onSongInfo={onSongInfo} />
              </SongPickHandler>
            </Route>
            <Route path="/TopPlayed" exact={true}>
            <SongPickHandler 
              onSongInfoComplete={onSongInfoComplete} 
              onSongPickComplete={onSongPickComplete} 
              selectedSongInfo={selectedSongInfo} 
              selectedSong={selectedSong}>
                <TopSongs onSongPick={onSongPick} onSongInfo={onSongInfo} />
              </SongPickHandler>
            </Route>
            <Redirect to="/" />
          </IonRouterOutlet>
        </IonSplitPane>
      </AuthCheck>
    </IonReactRouter>
  );
};

export default Router;
