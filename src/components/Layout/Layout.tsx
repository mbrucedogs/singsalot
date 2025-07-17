import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Title */}
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                🎤 Karaoke App
              </h1>
              {controllerName && (
                <span className="ml-4 text-sm text-gray-500">
                  Party: {controllerName}
                </span>
              )}
            </div>

            {/* User Info & Logout */}
            <div className="flex items-center space-x-4">
              {currentSinger && (
                <div className="flex items-center space-x-3">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{currentSinger}</span>
                    {isAdmin && (
                      <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        Admin
                      </span>
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
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            <p>🎵 Powered by Firebase Realtime Database</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 