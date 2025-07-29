import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user data in localStorage when the app loads
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    
    if (savedUser && savedToken) {
      try {
        const parsedUser = JSON.parse(savedUser);
        console.log('Loading saved user data:', parsedUser); // Debug log
        setUser(parsedUser);
        setToken(savedToken);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        // Clear invalid data
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, authToken) => {
    // Ensure we have all required user data
    if (!userData || !authToken) {
      console.error('Invalid login data received');
      return;
    }

    // Log the user data being set
    console.log('Setting user data in context:', userData);
    
    // Ensure userNumber is present
    if (!userData.userNumber) {
      console.warn('User data missing userNumber:', userData);
    }
    
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateUser = (updatedUser) => {
    if (!updatedUser) {
      console.error('Invalid user data for update');
      return;
    }
    
    // Ensure we preserve the userNumber when updating
    const newUserData = {
      ...user,
      ...updatedUser,
      userNumber: updatedUser.userNumber || user?.userNumber
    };
    
    console.log('Updating user data in context:', newUserData); // Debug log
    
    setUser(newUserData);
    localStorage.setItem('user', JSON.stringify(newUserData));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 