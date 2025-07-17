import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import type { LayoutProps } from '../../types';

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // TODO: Replace with actual Redux selectors
  const currentSinger = useSelector((state: RootState) => state.auth?.singer || '');
  const isAdmin = useSelector((state: RootState) => state.auth?.isAdmin || false);
  const controllerName = useSelector((state: RootState) => state.auth?.controller || '');

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
                  Controller: {controllerName}
                </span>
              )}
            </div>

            {/* User Info */}
            <div className="flex items-center space-x-4">
              {currentSinger && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{currentSinger}</span>
                  {isAdmin && (
                    <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      Admin
                    </span>
                  )}
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