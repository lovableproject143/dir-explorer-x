import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  email: string;
  isAdmin?: boolean;
}

interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  emergencyContact: string;
  emergencyPhone: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  saveUserProfile: (profile: UserProfile) => void;
  adminLogin: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedProfile = localStorage.getItem('userProfile');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedProfile) {
      setUserProfile(JSON.parse(storedProfile));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    const userData = { email };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const register = async (email: string, password: string) => {
    // Simulate API call
    const userData = { email };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const adminLogin = async (email: string, password: string) => {
    // Simulate admin login
    if (email === 'admin@temple.com' && password === 'admin123') {
      const adminUser = { email, isAdmin: true };
      setUser(adminUser);
      localStorage.setItem('user', JSON.stringify(adminUser));
    } else {
      throw new Error('Invalid admin credentials');
    }
  };

  const logout = () => {
    setUser(null);
    setUserProfile(null);
    localStorage.removeItem('user');
    localStorage.removeItem('userProfile');
    sessionStorage.clear();
  };

  const saveUserProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('userProfile', JSON.stringify(profile));
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, login, register, logout, saveUserProfile, adminLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
