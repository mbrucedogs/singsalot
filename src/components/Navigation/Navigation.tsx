import React, { useState, useEffect } from 'react';
import { IonMenu, IonHeader, IonToolbar, IonContent, IonList, IonItem, IonLabel, IonIcon } from '@ionic/react';
import { timeOutline, settingsOutline, listOutline, musicalNotesOutline, peopleOutline, peopleCircleOutline, heartOutline, searchOutline, starOutline } from 'ionicons/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { PlayerControls } from '../common';
import { useAppSelector } from '../../redux';
import { selectIsAdmin } from '../../redux';
import { debugLog } from '../../utils/logger';

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const isAdmin = useAppSelector(selectIsAdmin);

  const allNavItems = [
    { path: '/search', label: 'Search', icon: searchOutline },
    { path: '/queue', label: 'Queue', icon: musicalNotesOutline },
    { path: '/singers', label: 'Singers', icon: peopleCircleOutline },
    { path: '/artists', label: 'Artists', icon: peopleOutline },
    { path: '/top-played', label: 'Top 100 Played', icon: starOutline },
    { path: '/favorites', label: 'Favorites', icon: heartOutline },
    { path: '/history', label: 'History', icon: timeOutline },
    { path: '/new-songs', label: 'New Songs', icon: listOutline },
    { path: '/song-lists', label: 'Song Lists', icon: listOutline },
    { path: '/settings', label: 'Settings', icon: settingsOutline, adminOnly: true },
  ];

  // Filter navigation items based on admin status
  const navItems = allNavItems.filter(item => !item.adminOnly || isAdmin);

  // Check screen size for responsive menu behavior
  useEffect(() => {
    const checkScreenSize = () => {
      const large = window.innerWidth >= 768;
      debugLog('Screen width:', window.innerWidth, 'Is large screen:', large);
      setIsLargeScreen(large);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleNavigation = (path: string) => {
    navigate(path);
    // Close menu on mobile after navigation
    if (!isLargeScreen) {
      const menu = document.querySelector('ion-menu');
      if (menu) {
        menu.close();
      }
    }
  };

  // For large screens, render a fixed sidebar instead of a menu
  if (isLargeScreen) {
    debugLog('Rendering large screen sidebar');
    return (
      <div 
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          height: '100vh',
          width: '256px',
          backgroundColor: 'var(--ion-background-color)',
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
          zIndex: 1000,
          borderRight: '1px solid var(--ion-border-color)',
          overflowY: 'auto'
        }}
      >
        <div style={{ 
          padding: '16px', 
          borderBottom: '1px solid var(--ion-border-color)', 
          backgroundColor: 'var(--ion-color-light)' 
        }}>
          <h2 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            color: 'var(--ion-text-color)', 
            margin: 0 
          }}>Karaoke</h2>
          <p style={{ 
            fontSize: '14px', 
            color: 'var(--ion-color-medium)', 
            margin: '4px 0 0 0' 
          }}>Singer: Matt</p>
        </div>
        <nav style={{ marginTop: '16px' }}>
          {navItems.map((item) => (
            <div
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                cursor: 'pointer',
                backgroundColor: location.pathname === item.path ? 'var(--ion-color-primary-tint)' : 'transparent',
                color: location.pathname === item.path ? 'var(--ion-color-primary)' : 'var(--ion-text-color)',
                borderRight: location.pathname === item.path ? '2px solid var(--ion-color-primary)' : 'none',
                transition: 'background-color 0.2s, color 0.2s'
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== item.path) {
                  e.currentTarget.style.backgroundColor = 'var(--ion-color-light)';
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== item.path) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <IonIcon 
                icon={item.icon} 
                style={{ 
                  marginRight: '12px',
                  fontSize: '20px'
                }} 
              />
              <span style={{ fontWeight: '500' }}>{item.label}</span>
            </div>
          ))}
        </nav>
        
        {/* Player Controls */}
        <div style={{ marginTop: 'auto', padding: '16px' }}>
          <PlayerControls />
        </div>
      </div>
    );
  }

  // For mobile screens, use the Ionic menu
  debugLog('Rendering mobile menu');
  return (
    <IonMenu 
      contentId="main-content" 
      type="overlay"
      side="start"
      swipeGesture={true}
      style={{
        '--width': '250px'
      } as React.CSSProperties}
    >
      <IonHeader>
        <IonToolbar>
          <div style={{ 
            padding: '16px', 
            borderBottom: '1px solid var(--ion-border-color)', 
            backgroundColor: 'var(--ion-color-light)' 
          }}>
            <h2 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: 'var(--ion-text-color)', 
              margin: 0 
            }}>Karaoke</h2>
            <p style={{ 
              fontSize: '14px', 
              color: 'var(--ion-color-medium)', 
              margin: '4px 0 0 0' 
            }}>Singer: Matt</p>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {navItems.map((item) => (
            <IonItem
              key={item.path}
              button
              onClick={() => handleNavigation(item.path)}
              className={location.pathname === item.path ? 'ion-activated' : ''}
            >
              <IonIcon icon={item.icon} slot="start" />
              <IonLabel>{item.label}</IonLabel>
            </IonItem>
          ))}
        </IonList>
        
        {/* Player Controls for Mobile */}
        <div style={{ padding: '16px' }}>
          <PlayerControls />
        </div>
      </IonContent>
    </IonMenu>
  );
};

export default Navigation; 