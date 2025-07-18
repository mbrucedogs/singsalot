import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectIsAuthenticated } from '../../redux/authSlice';
import { debugLog } from '../../utils/logger';
import { LoginPrompt } from './index';

interface AuthInitializerProps {
  children: React.ReactNode;
}

const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
  const [searchParams] = useSearchParams();
  const [showLogin, setShowLogin] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [hasProcessedAdminParam, setHasProcessedAdminParam] = useState(false);
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    debugLog('AuthInitializer effect - isAuthenticated:', isAuthenticated, 'showLogin:', showLogin);
    // Only process admin parameter once
    if (hasProcessedAdminParam) return;

    // Check for admin parameter in URL
    const isAdmin = searchParams.get('admin') === 'true';
    
    if (isAdmin) {
      // Set admin mode but don't auto-authenticate
      setIsAdminMode(true);
      setHasProcessedAdminParam(true);
    }
    
    // Show login prompt if not authenticated (for both admin and regular users)
    if (!isAuthenticated) {
      setShowLogin(true);
    }
  }, [searchParams, dispatch, isAuthenticated, hasProcessedAdminParam]);

  // Clean up admin parameter after successful authentication
  useEffect(() => {
    if (isAuthenticated && isAdminMode && hasProcessedAdminParam) {
      // Clean up URL after successful admin login
      if (window.history.replaceState) {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('admin');
        window.history.replaceState({}, '', newUrl.toString());
      }
    }
  }, [isAuthenticated, isAdminMode, hasProcessedAdminParam]);

  // Show login prompt if not authenticated
  if (showLogin && !isAuthenticated) {
    return (
      <LoginPrompt
        isAdmin={isAdminMode}
        onComplete={() => {
          debugLog('onComplete called, setting showLogin to false');
          setShowLogin(false);
        }}
      />
    );
  }

  return <>{children}</>;
};

export default AuthInitializer; 