import React from 'react';
import ActionButton from './ActionButton';
import { useAppSelector } from '../../redux';
import { selectPlayerState, selectIsAdmin, selectQueue } from '../../redux';
import { playerService } from '../../firebase/services';
import { selectControllerName } from '../../redux';
import { useToast } from '../../hooks/useToast';
import { PlayerState } from '../../types';

interface PlayerControlsProps {
  className?: string;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({ className = '' }) => {
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

  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-medium text-gray-900">Player Controls</h3>
          <span className={`px-2 py-1 text-xs rounded-full ${
            currentState === PlayerState.playing 
              ? 'bg-green-100 text-green-800' 
              : currentState === PlayerState.paused 
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {currentState}
          </span>
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-center space-x-3">
        {currentState === PlayerState.playing ? (
          <ActionButton
            onClick={handlePause}
            variant="primary"
            size="lg"
          >
            ⏸️ Pause
          </ActionButton>
        ) : (
          <ActionButton
            onClick={handlePlay}
            variant="primary"
            size="lg"
            disabled={!hasSongsInQueue}
          >
            ▶️ Play
          </ActionButton>
        )}
        
        {currentState !== PlayerState.stopped && (
          <ActionButton
            onClick={handleStop}
            variant="danger"
            size="sm"
          >
            ⏹️ Stop
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
    </div>
  );
};

export default PlayerControls; 