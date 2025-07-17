import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setAuth } from '../../redux/authSlice';
import { selectIsAuthenticated } from '../../redux/authSlice';
import { CONTROLLER_NAME } from '../../constants';
import { LoginPrompt } from './index';
import type { Authentication } from '../../types';

interface AuthInitializerProps {
  children: React.ReactNode;
}

const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
  const [searchParams] = useSearchParams();
  const [showLogin, setShowLogin] = useState(false);
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    // Check for admin parameter in URL
    const isAdmin = searchParams.get('admin') === 'true';
    
    // If admin parameter is present, auto-authenticate
    if (isAdmin) {
      const auth: Authentication = {
        authenticated: true,
        singer: 'Admin',
        isAdmin: true,
        controller: CONTROLLER_NAME,
      };
      dispatch(setAuth(auth));
      
      // Clean up URL
      if (window.history.replaceState) {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('admin');
        window.history.replaceState({}, '', newUrl.toString());
      }
    } else if (!isAuthenticated) {
      // Show login prompt for regular users
      setShowLogin(true);
    }
  }, [searchParams, dispatch, isAuthenticated]);

  // Show login prompt if not authenticated
  if (showLogin && !isAuthenticated) {
    return (
      <LoginPrompt
        isAdmin={false}
        onComplete={() => setShowLogin(false)}
      />
    );
  }

  return <>{children}</>;
};

export default AuthInitializer; 