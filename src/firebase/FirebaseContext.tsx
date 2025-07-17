import { createContext } from 'react';

interface FirebaseContextType {
  isConnected: boolean;
  syncStatus: 'idle' | 'loading' | 'success' | 'error';
}

export const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined); 