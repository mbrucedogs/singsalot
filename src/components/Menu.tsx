import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from '@ionic/react';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { stop, stopOutline, pause, pauseOutline, play, playOutline, time, timeOutline, settings, settingsOutline, list, listOutline, musicalNotes, musicalNotesOutline, peopleOutline, people, peopleCircle, peopleCircleOutline, heartOutline, heartSharp, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, trashOutline, trashSharp, warningOutline, warningSharp, searchOutline, search, starOutline, star } from 'ionicons/icons';
import { PlayerState } from "../models";
import { useAuthentication, usePlayer } from '../hooks';

function debugLog(container: string, label: string, value: any = null) {
  console.log(`debug - ${container} - ${label} `, value);
}

const appPages: AppPage[] = [
  {
    title: 'Search',
    url: '/Search',
    iosIcon: searchOutline,
    mdIcon: search
  },
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
    title: 'Top 100 Played',
    url: '/TopPlayed',
    iosIcon: starOutline,
    mdIcon: star
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
    title: 'New Songs',
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
  playerState: PlayerState;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

interface AdminState {
  title: string;
  actions: Array<AdminAction>;
}

export const Menu: React.FC = () => {

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

  const location = useLocation();
  const [adminState, setAdminState] = useState<AdminState | undefined>(undefined);
  const { playerState, setPlayerState } = usePlayer();
  const { authenticated, singer, isAdmin } = useAuthentication();

  useEffect(() => {

    if (isAdmin) {
      //debugLog('Menu', 'useEffect - currentPlayerState', currentPlayerState);
      switch (playerState) {
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
          setAdminState(undefined);
          break;
      }
    }

  }, [playerState])

  useEffect(() => {
    if(!isAdmin){
    }
  }, []);

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>Karaoke</IonListHeader>
          {authenticated && <IonNote>Singer: {singer}</IonNote>}
          {appPages.map((appPage, index) => {
              if(!isAdmin && index == appPages.length -1){ return null;}

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
              <IonItem lines="none" key={index} onClick={() => setPlayerState(action.playerState)}>
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
