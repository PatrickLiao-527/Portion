import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the user is already logged in
    const checkLoggedIn = async () => {
      try {
        const response = await axios.get('http://localhost:5555/auth/check', { withCredentials: true });
        //console.log('Auth check response:', response.data);
        setUser(response.data.user);
        setToken(response.data.token);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.log('User not authenticated');
          setUser(null);
          setToken(null);
        } else {
          console.error('Error checking authentication:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const signOut = async () => {
    try {
      await axios.post('http://localhost:5555/auth/logout', {}, { withCredentials: true });
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
export default AuthContext;
