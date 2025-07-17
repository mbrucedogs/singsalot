import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IonApp, IonHeader, IonToolbar, IonTitle, IonContent, IonChip, IonMenuButton } from '@ionic/react';
import { selectCurrentSinger, selectIsAdmin, selectControllerName } from '../../redux/authSlice';
import { logout } from '../../redux/authSlice';
import { ActionButton } from '../common';
import Navigation from '../Navigation/Navigation';
import type { LayoutProps } from '../../types';

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const currentSinger = useSelector(selectCurrentSinger);
  const isAdmin = useSelector(selectIsAdmin);
  const controllerName = useSelector(selectControllerName);
  const dispatch = useDispatch();
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  // Check screen size for responsive layout
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    // Reload the page to return to login screen
    window.location.reload();
  };

  return (
    <IonApp>
      {/* Navigation - rendered outside header for proper positioning */}
      <Navigation />
      
      {/* Main content wrapper */}
      <div style={{ 
        position: 'fixed',
        left: isLargeScreen ? '256px' : '0',
        top: 0,
        right: 0,
        bottom: 0,
        zIndex: 1
      }}>
        <IonHeader style={{ position: 'relative', zIndex: 2 }}>
          <IonToolbar>
            {/* Only show hamburger button on mobile */}
            {!isLargeScreen && <IonMenuButton slot="start" />}
            
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

        <IonContent 
          id="main-content" 
          className={isLargeScreen ? "ion-padding" : ""}
          style={{
            position: 'relative',
            zIndex: 1,
            height: 'calc(100vh - 56px)', // Subtract header height
            overflow: 'hidden' // Prevent main content from scrolling
          }}
        >
          {children}
        </IonContent>
      </div>
    </IonApp>
  );
};

export default Layout; 