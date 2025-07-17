import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { FIREBASE_CONFIG } from '../constants';

// Initialize Firebase
const app = initializeApp(FIREBASE_CONFIG);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

export default app; 