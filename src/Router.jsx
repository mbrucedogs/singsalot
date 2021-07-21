import { lazy } from 'react';
import { IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Menu from './components/Menu/Menu';

import Artists from './pages/Artists/Artists';
import Favorites from './pages/Favorites/Favorites';
import History from './pages/History/History';
import LatestSongs from './pages/LatestSongs/LatestSongs';
import Queue from './pages/Queue/Queue';
import Search from './pages/Search/Search';
import Settings from './pages/Settings/Settings';
import Singers from './pages/Singers/Singers';
import SongLists from './pages/SongLists/SongLists';

const Router = () => {
  return (
    <IonReactRouter>
        <IonSplitPane contentId="main">
        <Menu/>
        <IonRouterOutlet id="main" animated="true">
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
    </IonReactRouter>
  );
};

export default Router;
