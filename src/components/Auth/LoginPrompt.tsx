import { useState } from 'react';
import { IonIcon } from '@ionic/react';
import { micOutline } from 'ionicons/icons';
import { useAppDispatch } from '../../redux/hooks';
import { debugLog } from '../../utils/logger';
import { setAuth } from '../../redux/authSlice';
import { database } from '../../firebase/config';
import { ref, get } from 'firebase/database';
import type { Authentication } from '../../types';

interface LoginPromptProps {
  isAdmin: boolean;
  onComplete: () => void;
}

const LoginPrompt: React.FC<LoginPromptProps> = ({ isAdmin, onComplete }) => {
  const [singerName, setSingerName] = useState('');
  const [partyId, setPartyId] = useState('');
  const [error, setError] = useState('');
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    debugLog('Login form submitted');
    if (!partyId.trim() || !singerName.trim()) {
      setError('Please enter both Party Id and your name.');
      return;
    }
    setError('');
    
    // Check if controller exists in Firebase
    try {
      const controllerRef = ref(database, `controllers/${partyId.trim()}`);
      const snapshot = await get(controllerRef);
      
      if (!snapshot.exists()) {
        setError('Invalid Party Id. Please check your Party Id and try again.');
        return;
      }
      
      const auth: Authentication = {
        authenticated: true,
        singer: singerName.trim(),
        isAdmin: isAdmin,
        controller: partyId.trim(),
      };
      debugLog('Dispatching auth:', auth);
      dispatch(setAuth(auth));
      debugLog('Calling onComplete');
      onComplete();
    } catch (error) {
      console.error('Error checking controller:', error);
      setError('Error connecting to server. Please try again.');
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="app-brand">
              <div className="microphone-icon">
                <IonIcon icon={micOutline} size='large'/>
              </div>
              <h2 className="app-name">Sings-A-Lot</h2>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="partyId" className="form-label">
                Party Id
              </label>
              <input
                type="text"
                id="partyId"
                value={partyId}
                onChange={(e) => setPartyId(e.target.value)}
                className="form-input"
                autoFocus
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="singerName" className="form-label">
                FirstName
              </label>
              <input
                type="text"
                id="singerName"
                value={singerName}
                onChange={(e) => setSingerName(e.target.value)}
                className="form-input"
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #000000;
          color: #ffffff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .login-card {
          width: 100%;
          max-width: 400px;
          padding: 2rem;
          text-align: center;
        }

        .login-header {
          margin-bottom: 2rem;
        }

        .login-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0 0 1rem 0;
          color: #ffffff;
        }

        .app-brand {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 2rem;
        }

        .microphone-icon {
          font-size: 3rem;
          color: #3b82f6;
        }

        .microphone-icon ion-icon {
          width: 3rem;
          height: 3rem;
        }

        .app-name {
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
          color: #ffffff;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          text-align: left;
        }

        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
          color: #ffffff;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem;
          border: none;
          border-bottom: 1px solid #ffffff;
          background: transparent;
          color: #ffffff;
          font-size: 1rem;
          outline: none;
          transition: border-color 0.2s;
        }

        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .form-input:focus {
          border-bottom-color: #3b82f6;
        }

        .error-message {
          color: #ef4444;
          font-size: 0.875rem;
          text-align: center;
          margin-top: 0.5rem;
        }

        .login-button {
          width: 100%;
          padding: 0.75rem 1.5rem;
          background-color: #3b82f6;
          color: #ffffff;
          border: none;
          border-radius: 0.5rem;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
          margin-top: 1rem;
        }

        .login-button:hover {
          background-color: #2563eb;
        }

        .login-button:active {
          transform: translateY(1px);
        }

        /* Light mode overrides */
        @media (prefers-color-scheme: light) {
          .login-container {
            background-color: #ffffff;
            color: #000000;
          }
          
          .login-title,
          .app-name,
          .form-label {
            color: #000000;
          }
          
          .form-input {
            border-bottom-color: #000000;
            color: #000000;
          }
          
          .form-input::placeholder {
            color: rgba(0, 0, 0, 0.6);
          }
        }
      `}</style>
    </>
  );
};

export default LoginPrompt; 