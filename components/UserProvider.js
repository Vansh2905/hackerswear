"use client";
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import PropTypes from 'prop-types';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { data: session} = useSession();

  useEffect(() => {
    setMounted(true);
    
    // Check NextAuth session first
    if (session?.user) {
      setUser({
        id: session.user.id || session.user.email,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image
      });
      setIsLoggedIn(true);
    } else {
      // Fallback to sessionStorage for JWT users
      const savedUser = sessionStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setIsLoggedIn(true);
      }
    }
  }, [session]);

  const login = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    // ✅ Store only in sessionStorage (clears on tab/browser close)
    sessionStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = async () => {
    setUser(null);
    setIsLoggedIn(false);
    sessionStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Sign out from NextAuth if session exists
    if (session) {
      await signOut({ callbackUrl: '/' });
    } else {
      router.push('/');
    }
  };

  const contextValue = useMemo(
    () => ({
      user,
      isLoggedIn,
      login,
      logout,
    }),
    [user, isLoggedIn]
  );

  if (!mounted) {
    return (
      <UserContext.Provider value={contextValue}>
        {children}
      </UserContext.Provider>
    );
  }

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
