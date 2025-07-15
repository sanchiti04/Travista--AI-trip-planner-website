import { createContext, useContext, useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for existing user in localStorage on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v1/userinfo',
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
              Accept: 'application/json',
            },
          }
        );
        
        const userData = userInfo.data;
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
      }
    },
    onError: (error) => {
      console.error('Login Failed:', error);
      throw error;
    },
  });

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 