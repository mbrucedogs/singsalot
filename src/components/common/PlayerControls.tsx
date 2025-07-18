import React from 'react';
import { IonCard, IonCardContent, IonChip, IonIcon } from '@ionic/react';
import { playOutline, pauseOutline, stopOutline, play, pause, stop } from 'ionicons/icons';
import ActionButton from './ActionButton';
import { useAppSelector } from '../../redux';
import { selectPlayerState, selectIsAdmin, selectQueue } from '../../redux';
import { playerService } from '../../firebase/services';
import { selectControllerName } from '../../redux';
import { useToast } from '../../hooks/useToast';
import { PlayerState } from '../../types';

interface PlayerControlsProps {
  className?: string;
  variant?: 'light' | 'dark';
}

const PlayerControls: React.FC<PlayerControlsProps> = ({ className = '', variant = 'light' }) => {
  const playerState = useAppSelector(selectPlayerState);
  const isAdmin = useAppSelector(selectIsAdmin);
  const controllerName = useAppSelector(selectControllerName);
  const queue = useAppSelector(selectQueue);
  const { showSuccess, showError } = useToast();

  // Debug logging
  console.log('PlayerControls - playerState:', playerState);
  console.log('PlayerControls - isAdmin:', isAdmin);
  console.log('PlayerControls - queue length:', Object.keys(queue).length);

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
  const hasSongsInQueue = Object.keys(queue).length > 0;

  console.log('PlayerControls - currentState:', currentState);
  console.log('PlayerControls - hasSongsInQueue:', hasSongsInQueue);

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

  const getStatusText = () => {
    switch (currentState) {
      case PlayerState.playing:
        return 'Currently Playing';
      case PlayerState.paused:
        return 'Currently Paused';
      default:
        return 'Currently Stopped';
    }
  };

  // Dark mode variant
  if (variant === 'dark') {
    return (
      <div className={`bg-black text-white ${className}`}>
        {/* Status Text */}
        <h3 className="text-lg font-bold">{getStatusText()}</h3>
        
        {/* Control Buttons */}
        <div>
          {currentState === PlayerState.playing ? (
            <div 
              className="flex items-center cursor-pointer hover:bg-gray-800"
              style={{ padding: '12px 0px' }}
              onClick={handlePause}
            >
              <IonIcon 
                icon={pauseOutline} 
                style={{ 
                  marginRight: '12px',
                  fontSize: '24px'
                }} 
              />
              <span style={{ fontWeight: '500' }}>Pause</span>
            </div>
          ) : (
            <div 
              className="flex items-center cursor-pointer hover:bg-gray-800"
              style={{ padding: '12px 0px' }}
              onClick={handlePlay}
            >
              <IonIcon 
                icon={playOutline} 
                style={{ 
                  marginRight: '12px',
                  fontSize: '24px'
                }} 
              />
              <span style={{ fontWeight: '500' }}>Play</span>
            </div>
          )}
          
          {currentState !== PlayerState.stopped && (
            <div 
              className="flex items-center cursor-pointer hover:bg-gray-800"
              style={{ padding: '12px 0px' }}
              onClick={handleStop}
            >
              <IonIcon 
                icon={stopOutline} 
                style={{ 
                  marginRight: '12px',
                  fontSize: '24px'
                }} 
              />
              <span style={{ fontWeight: '500' }}>Stop</span>
            </div>
          )}
        </div>
        
        {!hasSongsInQueue && (
          <div style={{ padding: '12px 0px' }} className="text-xs text-gray-400">
            Add songs to queue to enable playback controls
          </div>
        )}
      </div>
    );
  }

  // Light mode variant (original)
  return (
    <IonCard className={className}>
      <IonCardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-medium text-gray-900">Player Controls</h3>
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
        
        <div className="mt-3 text-xs text-gray-500 text-center">
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