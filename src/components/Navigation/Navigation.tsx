import React from 'react';
import { IonTabs, IonTabBar, IonTabButton, IonLabel, IonIcon } from '@ionic/react';
import { list, search, heart, add, mic, documentText, time, trophy, people } from 'ionicons/icons';
import { useLocation, useNavigate } from 'react-router-dom';

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/queue', label: 'Queue', icon: list },
    { path: '/search', label: 'Search', icon: search },
    { path: '/favorites', label: 'Favorites', icon: heart },
    { path: '/new-songs', label: 'New Songs', icon: add },
    { path: '/artists', label: 'Artists', icon: mic },
    { path: '/song-lists', label: 'Song Lists', icon: documentText },
    { path: '/history', label: 'History', icon: time },
    { path: '/top-played', label: 'Top 100', icon: trophy },
    { path: '/singers', label: 'Singers', icon: people },
  ];

  // For mobile, show bottom tabs with main features
  const mobileNavItems = [
    { path: '/queue', label: 'Queue', icon: list },
    { path: '/search', label: 'Search', icon: search },
    { path: '/favorites', label: 'Favorites', icon: heart },
    { path: '/history', label: 'History', icon: time },
  ];

  // Check if we're on mobile (you can adjust this breakpoint)
  const isMobile = window.innerWidth < 768;

  const currentItems = isMobile ? mobileNavItems : navItems;

  return (
    <>
      {isMobile ? (
        <IonTabs>
          <IonTabBar slot="bottom">
            {currentItems.map((item) => (
              <IonTabButton
                key={item.path}
                tab={item.path}
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              >
                <IonIcon icon={item.icon} />
                <IonLabel>{item.label}</IonLabel>
              </IonTabButton>
            ))}
          </IonTabBar>
        </IonTabs>
      ) : (
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              {currentItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`
                    flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors
                    ${location.pathname === item.path
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <IonIcon icon={item.icon} className="mr-2" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </nav>
      )}
    </>
  );
};

export default Navigation; 