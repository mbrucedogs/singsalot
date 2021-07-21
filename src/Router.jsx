import { lazy } from 'react';
import { IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Menu from './components/Menu/Menu';

const Artists = lazy(() => import('./pages/Artists/Artists'));
const Favorites  = lazy(() => import('./pages/Favorites/Favorites'));
const History  = lazy(() => import('./pages/History/History'));
const LatestSongs  = lazy(() => import('./pages/LatestSongs/LatestSongs'));
const Queue  = lazy(() => import('./pages/Queue/Queue'));
const Search  = lazy(() => import('./pages/Search/Search'));
const Settings  = lazy(() => import('./pages/Settings/Settings'));
const Singers  = lazy(() => import('./pages/Singers/Singers'));
const SongLists  = lazy(() => import('./pages/SongLists/SongLists'));

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
