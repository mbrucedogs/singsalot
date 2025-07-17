import { useEffect, useState, type ReactNode } from 'react';
import { database } from './config';
import { ref, onValue, off } from 'firebase/database';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setController } from '../redux/controllerSlice';
import { type Controller, PlayerState } from '../types';
import { FirebaseContext } from './FirebaseContext';
import { selectAuth } from '../redux/authSlice';

interface FirebaseProviderProps {
  children: ReactNode;
}

export const FirebaseProvider = ({ children }: FirebaseProviderProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [syncStatus, setLocalSyncStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const controllerName = auth?.controller;
  const isAuthenticated = auth?.authenticated;

  useEffect(() => {
    if (!isAuthenticated || !controllerName) {
      setIsConnected(false);
      setLocalSyncStatus('idle');
      return;
    }
    const controllerRef = ref(database, `controllers/${controllerName}`);
    setLocalSyncStatus('loading');
    onValue(
      controllerRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const controllerData = snapshot.val() as Controller;
          dispatch(setController(controllerData));
          setLocalSyncStatus('success');
          setIsConnected(true);
        } else {
          // Initialize empty controller if it doesn't exist
          const emptyController: Controller = {
            favorites: {},
            history: {},
            topPlayed: {},
            newSongs: {},
            player: {
              queue: {},
              settings: {
                autoadvance: false,
                userpick: false
              },
              singers: {},
              state: {
                state: PlayerState.stopped
              }
            },
            songList: {},
            songs: {}
          };
          dispatch(setController(emptyController));
          setLocalSyncStatus('success');
          setIsConnected(true);
        }
      },
      (error) => {
        console.error('Firebase sync error:', error);
        setLocalSyncStatus('error');
        setIsConnected(false);
      }
    );
    return () => {
      off(controllerRef);
    };
  }, [dispatch, isAuthenticated, controllerName]);

  const value = {
    isConnected,
    syncStatus
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}; 