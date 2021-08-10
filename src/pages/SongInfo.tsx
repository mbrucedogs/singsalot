import Page from '../components/Page';
import { useHistory } from 'react-router';
import { IonButton, IonCol, IonGrid, IonRow } from '@ionic/react';
import { Song } from '../models';
import { usePlayer } from '../hooks/usePlayer';
import SongDiv from '../components/SongDiv';
import { useAuthentication } from '../hooks/useAuthentication';
import { useSongHistory } from "../hooks/useSongHistory";
import { useFavorites } from '../hooks/useFavorites';

const SongPickHandler = ({ }) => {
    const history = useHistory();
    const { favorites } = useFavorites();
    const { isAdmin, singer } = useAuthentication();
    const { addSongHistory } = useSongHistory();
    const { singers, selectedSong, setSelectedSong, addToQueue } = usePlayer();
    const pageName = 'Song Info';

    const isFavorited = (song: Song): boolean => {
        
        return false;
    }

    const isDisabled = (song: Song): boolean => {
        return false;
    }

    const onSongPick = () => {
        if (selectedSong) {
            console.log("SongContainer - songPick", selectedSong);
            if (isAdmin) {
                history.push("/SingerPick");
            } else {
                let found = singers.find(s => s.name === singer)
                if (found) {
                    addToQueue(found, selectedSong).then(s => {
                        history.push("/Queue");
                    });
                } else {
                    history.push("/SingerPick");
                }
            }
        }
    }

    const onArtistSearch = () => {
        if (selectedSong && selectedSong.artist) {
            history.push(`/Search/${selectedSong.artist}`)
        }
    }

    return (
        <Page name={pageName}>
            <>
                {selectedSong &&
                    <>
                        <SongDiv song={selectedSong} showPath={true} allowActions={false} showCount={true} />
                        <IonGrid>
                            <IonRow>
                                <IonCol size="3">
                                    <IonButton expand="block" onClick={(e) => { onSongPick() }}>Queue Song</IonButton>
                                    <IonButton expand="block" onClick={(e) => { onArtistSearch() }}>Artist Songs</IonButton>
                                    <IonButton expand="block">{isFavorited(selectedSong) ? "Un-Favorite" : "Favorite"} Song</IonButton>
                                    <IonButton expand="block">{isDisabled(selectedSong) ? "Enable" : "Disable"} Song</IonButton>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </>
                }
            </>
        </Page>
    );
};

export default SongPickHandler;