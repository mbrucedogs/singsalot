import React from 'react';
import { IonCard, IonCardContent, IonChip, IonIcon } from '@ionic/react';
import { play, pause, stop } from 'ionicons/icons';
import { useAppSelector } from '../../redux';
import { selectIsAdmin, selectPlayerState, selectQueueLength, selectControllerName } from '../../redux';
import { playerService } from '../../firebase/services';
import { PlayerState } from '../../types';
import ActionButton from './ActionButton';
import { useToast } from '../../hooks/useToast';
import { debugLog } from '../../utils/logger';

interface PlayerControlsProps {
  className?: string;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({ className = '' }) => {
  const isAdmin = useAppSelector(selectIsAdmin);
  const playerState = useAppSelector(selectPlayerState);
  const queueLength = useAppSelector(selectQueueLength);
  const controllerName = useAppSelector(selectControllerName);
  const { showSuccess, showError } = useToast();

  // Debug logging
  debugLog('PlayerControls - playerState:', playerState);
  debugLog('PlayerControls - isAdmin:', isAdmin);
  debugLog('PlayerControls - queue length:', queueLength);

  const handlePlay = async () => {
    if (!controllerName) return;
    
    try {
      await playerService.updatePlayerStateValue(controllerName, PlayerState.playing);
      showSuccess('Playback started');
    } catch (error) {
      console.error('Failed to start playback:', error);
      showError('Failed to start playback');
    }
  };

  const handlePause = async () => {
    if (!controllerName) return;
    
    try {
      await playerService.updatePlayerStateValue(controllerName, PlayerState.paused);
      showSuccess('Playback paused');
    } catch (error) {
      console.error('Failed to pause playback:', error);
      showError('Failed to pause playback');
    }
  };

  const handleStop = async () => {
    if (!controllerName) return;
    
    try {
      await playerService.updatePlayerStateValue(controllerName, PlayerState.stopped);
      showSuccess('Playback stopped');
    } catch (error) {
      console.error('Failed to stop playback:', error);
      showError('Failed to stop playback');
    }
  };

  // Only show controls for admin users
  if (!isAdmin) {
    return null;
  }

  const currentState = playerState?.state || PlayerState.stopped;
  const hasSongsInQueue = queueLength > 0;

  debugLog('PlayerControls - currentState:', currentState);
  debugLog('PlayerControls - hasSongsInQueue:', hasSongsInQueue);

  const getStateColor = () => {
    switch (currentState) {
      case PlayerState.playing:
        return 'success';
      case PlayerState.paused:
        return 'warning';
      default:
        return 'medium';
    }
  };

  return (
    <IonCard className={className}>
      <IonCardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-medium">Player Controls</h3>
            <IonChip color={getStateColor()}>
              {currentState}
            </IonChip>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-center space-x-3">
          {currentState === PlayerState.playing ? (
            <ActionButton
              onClick={handlePause}
              variant="primary"
              size="sm"
            >
              <IonIcon icon={pause} slot="icon-only" />
            </ActionButton>
          ) : (
            <ActionButton
              onClick={handlePlay}
              variant="primary"
              size="sm"
              disabled={!hasSongsInQueue}
            >
              <IonIcon icon={play} slot="icon-only" />
            </ActionButton>
          )}
          
          {currentState !== PlayerState.stopped && (
            <ActionButton
              onClick={handleStop}
              variant="danger"
              size="sm"
            >
              <IonIcon icon={stop} slot="icon-only" />
            </ActionButton>
          )}
        </div>
        
        <div className="mt-3 text-xs text-center">
          Admin controls - Only visible to admin users
          {!hasSongsInQueue && (
            <div className="mt-1 text-orange-600">
              Add songs to queue to enable playback controls
            </div>
          )}
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default PlayerControls; 