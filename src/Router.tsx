import { IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import { 
  Artists,
  Disabled,
  Favorites,
  History,
  LatestSongs,
  Login,
  Queue,
  Search,
  Settings,
  Singers,
  SongInfo,
  SongLists,
  SingerPick, 
  TopSongs
} from './pages'
import { Menu, FirebaseReduxHandler } from './components';
import { useAuthentication, usePlayer } from './hooks';

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
  const { addSinger } = usePlayer();
  const { authenticated, login } = useAuthentication();
  
  const onLogin = (isAdmin: boolean, controllerId: string, singerName: string): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
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
            <Route path="/Disabled" exact={true} component={Disabled}/>
            <Route path="/Favorites" exact={true} component={Favorites}/>
            <Route path="/History" exact={true} component={History}/>
            <Route path="/LatestSongs" exact={true} component={LatestSongs}/>
            <Route path="/Queue" component={Queue}/>
            <Route path="/Search" component={Search}/>
            <Route path="/Search/:searchParam" component={Search}/>
            <Route path="/Settings" exact={true} component={Settings} />
            <Route path="/Singers" exact={true} component={Singers} />
            <Route path="/SingerPick" exact={true} component={SingerPick} />
            <Route path="/SongInfo" exact={true} component={SongInfo} />
            <Route path="/SongLists" exact={true} component={SongLists}/>
            <Route path="/TopPlayed" exact={true} component={TopSongs}/>
            <Redirect to="/" />
          </IonRouterOutlet>
        </IonSplitPane>
      </AuthCheck>
    </IonReactRouter>
  );
};

export default Router;
