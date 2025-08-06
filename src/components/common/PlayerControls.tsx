import React from 'react';
import { IonCard, IonCardContent, IonChip, IonIcon } from '@ionic/react';
import { pauseOutline, playOutline, stopOutline } from 'ionicons/icons';
import ActionButton from './ActionButton';
import { ActionButtonVariant, ActionButtonSize, ActionButtonIconSlot } from '../../types';
import { Icons } from '../../constants';
import { useAppSelector } from '../../redux';
import { selectPlayerState, selectIsAdmin, selectQueueLength, selectControllerName, selectQueue } from '../../redux';
import { playerService, historyService, queueService } from '../../firebase/services';
import { debugLog } from '../../utils/logger';
import { useToast } from '../../hooks/useToast';
import { PlayerState } from '../../types';

interface PlayerControlsProps {
  className?: string;
  variant?: 'light' | 'dark';
}

const PlayerControls: React.FC<PlayerControlsProps> = ({ className = '', variant = 'light' }) => {
  const isAdmin = useAppSelector(selectIsAdmin);
  const playerState = useAppSelector(selectPlayerState);
  const queueLength = useAppSelector(selectQueueLength);
  const controllerName = useAppSelector(selectControllerName);
  const queue = useAppSelector(selectQueue);
  const toast = useToast();
  const showSuccess = toast?.showSuccess;
  const showError = toast?.showError;

  // Debug logging
  debugLog('PlayerControls - playerState:', playerState);
  debugLog('PlayerControls - isAdmin:', isAdmin);
  debugLog('PlayerControls - queue length:', queueLength);

  const handlePlay = async () => {
    if (!controllerName) return;
    
    try {
      await playerService.updatePlayerStateValue(controllerName, PlayerState.playing);
      
      // Add the first song in queue to history when playback starts (only if not already added)
      const queueItems = Object.values(queue) as any[];
      if (queueItems.length > 0) {
        const firstQueueItem = queueItems[0];
        const firstSong = firstQueueItem?.song;
        const queueItemKey = Object.keys(queue).find(key => queue[key] === firstQueueItem);
        
        if (firstSong && queueItemKey && !firstQueueItem.didAddHistory) {
          try {
            await historyService.addToHistory(controllerName, firstSong);
            
            // Mark this queue item as having been added to history
            await queueService.updateQueueItem(controllerName, queueItemKey, { didAddHistory: true });
            
            debugLog('Added first song to history when playback started:', firstSong.title);
            if (showSuccess) showSuccess(`${firstSong.title} added to history`);
          } catch (error) {
            console.error('Failed to add song to history:', error);
            // Don't show error to user as this is not critical
          }
        } else if (firstQueueItem.didAddHistory) {
          debugLog('Song already added to history, skipping:', {
            title: firstSong?.title,
            didAddHistory: firstQueueItem.didAddHistory
          });
        }
      }
      
      if (showSuccess) showSuccess('Playback started');
    } catch (error) {
      console.error('Failed to start playback:', error);
      if (showError) showError('Failed to start playback');
    }
  };

  const handlePause = async () => {
    if (!controllerName) return;
    
    try {
      await playerService.updatePlayerStateValue(controllerName, PlayerState.paused);
      if (showSuccess) showSuccess('Playback paused');
    } catch (error) {
      console.error('Failed to pause playback:', error);
      if (showError) showError('Failed to pause playback');
    }
  };

  const handleStop = async () => {
    if (!controllerName) return;
    
    try {
      await playerService.updatePlayerStateValue(controllerName, PlayerState.stopped);
      if (showSuccess) showSuccess('Playback stopped');
    } catch (error) {
      console.error('Failed to stop playback:', error);
      if (showError) showError('Failed to stop playback');
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

  const getStatusText = () => {
    if (!hasSongsInQueue) {
      return 'No songs in queue';
    }
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
        <div 
          className="flex items-center"
          style={{ padding: '12px 0px' }}
        >
          <span style={{ 
            fontWeight: '600', 
            fontSize: '16px',
          }}>
            {getStatusText()}
          </span>
        </div>
        {/* Control Buttons */}
        {hasSongsInQueue && (
          <>
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
                    fontSize: '20px'
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
                    fontSize: '20px'
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
                    fontSize: '20px'
                  }} 
                />
                <span style={{ fontWeight: '500' }}>Stop</span>
              </div>
            )}
          </>
        )}
        {!hasSongsInQueue && (
          <div style={{ padding: '12px 0px', marginLeft: 0 }} className="text-xs text-gray-400">
            Add songs to queue to enable playback controls
          </div>
        )}
      </div>
    );
  }

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
        {/* Only show controls if there are songs in the queue */}
        {hasSongsInQueue && (
          <div className="mt-4 flex items-center justify-center space-x-3">
            {currentState === PlayerState.playing ? (
              <ActionButton
                onClick={handlePause}
                variant={ActionButtonVariant.PRIMARY}
                size={ActionButtonSize.SMALL}
                icon={Icons.PAUSE}
                iconSlot={ActionButtonIconSlot.ICON_ONLY}
              />
            ) : (
              <ActionButton
                onClick={handlePlay}
                variant={ActionButtonVariant.PRIMARY}
                size={ActionButtonSize.SMALL}
                icon={Icons.PLAY}
                iconSlot={ActionButtonIconSlot.ICON_ONLY}
                disabled={!hasSongsInQueue}
              />
            )}
            {currentState !== PlayerState.stopped && (
              <ActionButton
                onClick={handleStop}
                variant={ActionButtonVariant.DANGER}
                size={ActionButtonSize.SMALL}
                icon={Icons.STOP}
                iconSlot={ActionButtonIconSlot.ICON_ONLY}
              />
            )}
          </div>
        )}
        <div className="mt-3 text-xs text-center">
          Admin controls - Only visible to admin users
          {!hasSongsInQueue && (
            <div className="mt-1 text-orange-600" style={{ marginLeft: 0 }}>
              Add songs to queue to enable playback controls
            </div>
          )}
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default PlayerControls; 