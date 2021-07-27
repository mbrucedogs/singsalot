import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
} from '@ionic/react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useLocation } from 'react-router-dom';
import { stop, stopOutline, pause, pauseOutline ,play, playOutline, time, timeOutline, settings, settingsOutline, list, listOutline, musicalNotes, musicalNotesOutline, peopleOutline, people, peopleCircle, peopleCircleOutline, heartOutline, heartSharp, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, trashOutline, trashSharp, warningOutline, warningSharp } from 'ionicons/icons';
import './Menu.css';
import { PlayerState } from '../../services/models';
import { useSelector } from 'react-redux';
import { selectPlayerState } from '../../store/store';

function debugLog(container: string, label: string, value: any = null) {
  console.log(`debug - ${container} - ${label} `, value);
}

const appPages: AppPage[] = [
  {
    title: 'Queue',
    url: '/Queue',
    iosIcon: musicalNotesOutline,
    mdIcon: musicalNotes
  },
  {
    title: 'Singers',
    url: '/Singers',
    iosIcon: peopleCircleOutline,
    mdIcon: peopleCircle
  },
  {
    title: 'Artists',
    url: '/Artists',
    iosIcon: peopleOutline,
    mdIcon: people
  },
  {
    title: 'Favorites',
    url: '/Favorites',
    iosIcon: heartOutline,
    mdIcon: heartSharp
  },
  {
    title: 'History',
    url: '/History',
    iosIcon: timeOutline,
    mdIcon: time
  },
  {
    title: 'Latest Songs',
    url: '/LatestSongs',
    iosIcon: listOutline,
    mdIcon: list
  },
  {
    title: 'Song Lists',
    url: '/SongLists',
    iosIcon: listOutline,
    mdIcon: list
  },
  {
    title: 'Settings',
    url: '/Settings',
    iosIcon: settingsOutline,
    mdIcon: settings
  }
];

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

interface AdminAction { 
  playerState: PlayerState ;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

interface AdminState { 
  title: string; 
  actions: Array<AdminAction>;
}

const Menu: React.FC = () => {
  
  const playActions: AdminAction[] = [
    {
      playerState: PlayerState.playing,
      iosIcon: playOutline,
      mdIcon: play,
      title: "Play"
    }
  ];

  const pauseActions: AdminAction[] = [
    {
      playerState: PlayerState.paused,
      iosIcon: pauseOutline,
      mdIcon: pause,
      title: "Pause"
    }, 
    {
      playerState: PlayerState.stopped,
      iosIcon: stopOutline,
      mdIcon: stop,
      title: "Stop"
    }
  ];

  const pauseAdminState: AdminState = {
    title: "Currently Paused",
    actions: playActions
  }

  const playAdminState: AdminState = { 
    title: "Currently Playing",
    actions: pauseActions
  }

  const stopAdminState: AdminState = { 
    title: "Currently Stopped",
    actions: playActions
  }

  const isAdmin: boolean = true;
  const location = useLocation();
  const [adminState, setAdminState]  = useState<AdminState | undefined>(undefined);
  const currentPlayerState = useSelector(selectPlayerState);

  useEffect(() => {
  
    //debugLog('Menu', 'useEffect - currentPlayerState', currentPlayerState);
    switch(currentPlayerState){
      case PlayerState.stopped: {
        setAdminState(stopAdminState);
        break;
      }
      case PlayerState.playing: {
        setAdminState(playAdminState);
        break;
      }
  
      case PlayerState.paused: {
        setAdminState(pauseAdminState);
        break;
      }
  
      default: 
        isAdmin ? setAdminState(stopAdminState) : setAdminState(undefined);
        break;
    }
  
  }, [currentPlayerState])
  
  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>Karaoke</IonListHeader>
          {/* <IonNote>hi@ionicframework.com</IonNote> */}
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>

        {adminState !== undefined && 
        <IonList id="labels-list">
          <IonListHeader>{adminState.title}</IonListHeader>
          {adminState.actions.map((action, index) => (
            <IonItem lines="none" key={index} onClick={() => console.log("here")}>
                <IonIcon slot="start" ios={action.iosIcon} md={action.mdIcon} />
                <IonLabel>{action.title}</IonLabel>
            </IonItem>
          ))}
        </IonList>        
        }

      </IonContent>
    </IonMenu>
  );
};

export default Menu;
