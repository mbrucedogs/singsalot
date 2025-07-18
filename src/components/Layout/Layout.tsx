import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { IonApp, IonHeader, IonToolbar, IonTitle, IonContent, IonMenuButton, IonIcon } from '@ionic/react';
import { logOut } from 'ionicons/icons';
import { logout } from '../../redux/authSlice';
import { ActionButton } from '../common';
import Navigation from '../Navigation/Navigation';
import { getPageTitle } from '../../utils/routeUtils';
import type { LayoutProps } from '../../types';

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  
  // Get the current page title
  const currentPageTitle = getPageTitle(location.pathname);

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
            
            <IonTitle style={{ textAlign: 'center', width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                <span>{currentPageTitle}</span>
              </div>
            </IonTitle>
            
            {/* Logout Button */}
            <div slot="end">
              <ActionButton
                onClick={handleLogout}
                variant="secondary"
                size="sm"
              >
                <IonIcon icon={logOut} />
              </ActionButton>
            </div>
          </IonToolbar>
        </IonHeader>

        <IonContent 
          id="main-content" 
          className={isLargeScreen ? "ion-padding" : ""}
          style={{
            position: 'relative',
            zIndex: 1,
            height: 'calc(100vh - 64px)', // Adjust header height
            overflow: 'auto', // Allow scrolling
            paddingBottom: '40px' // Add more bottom padding
          }}
        >
          {children}
        </IonContent>
      </div>
    </IonApp>
  );
};

export default Layout; 