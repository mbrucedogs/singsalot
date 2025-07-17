import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IonApp, IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonChip } from '@ionic/react';
import { selectCurrentSinger, selectIsAdmin, selectControllerName } from '../../redux/authSlice';
import { logout } from '../../redux/authSlice';
import { ActionButton } from '../common';
import type { LayoutProps } from '../../types';

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const currentSinger = useSelector(selectCurrentSinger);
  const isAdmin = useSelector(selectIsAdmin);
  const controllerName = useSelector(selectControllerName);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    // Reload the page to return to login screen
    window.location.reload();
  };

  return (
    <IonApp>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <div className="flex items-center">
              <span>🎤 Karaoke App</span>
              {controllerName && (
                <span className="ml-4 text-sm text-gray-500">
                  Party: {controllerName}
                </span>
              )}
            </div>
          </IonTitle>
          
          {/* User Info & Logout */}
          {currentSinger && (
            <div slot="end" className="flex items-center space-x-3">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{currentSinger}</span>
                {isAdmin && (
                  <IonChip color="primary">
                    Admin
                  </IonChip>
                )}
              </div>
              <ActionButton
                onClick={handleLogout}
                variant="secondary"
                size="sm"
              >
                Logout
              </ActionButton>
            </div>
          )}
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {children}
      </IonContent>

      <IonFooter>
        <IonToolbar>
          <div className="text-center text-sm text-gray-500">
            <p>🎵 Powered by Firebase Realtime Database</p>
          </div>
        </IonToolbar>
      </IonFooter>
    </IonApp>
  );
};

export default Layout; 