import { useState, useEffect } from 'react';
import { hashPassword, verifyPassword } from '../utils/encryption';
import { useAuditLog } from './useAuditLog';

interface User {
  id: string;
  email: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  recoverPassword: (email: string) => Promise<void>;
}

const STORAGE_KEY = 'securepass_user';

export const useAuth = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null);
  const { addLog } = useAuditLog();

  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_KEY);
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const savedCredentials = localStorage.getItem(`securepass_creds_${email}`);
    
    if (!savedCredentials) {
      throw new Error('Invalid email or password');
    }

    const { hashedPassword, salt } = JSON.parse(savedCredentials);
    const isValid = await verifyPassword(password, hashedPassword, salt);
    
    if (!isValid) {
      throw new Error('Invalid email or password');
    }

    const userData: User = {
      id: crypto.randomUUID(),
      email,
      createdAt: new Date().toISOString(),
    };

    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    addLog('User logged in');
  };

  const register = async (email: string, password: string): Promise<void> => {
    const existingCreds = localStorage.getItem(`securepass_creds_${email}`);
    
    if (existingCreds) {
      throw new Error('An account with this email already exists');
    }

    const { hashedPassword, salt } = await hashPassword(password);
    
    localStorage.setItem(`securepass_creds_${email}`, JSON.stringify({
      hashedPassword,
      salt,
      createdAt: new Date().toISOString(),
    }));

    const userData: User = {
      id: crypto.randomUUID(),
      email,
      createdAt: new Date().toISOString(),
    };

    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    addLog('User registered');
  };

  const logout = (): void => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    addLog('User logged out');
  };

  const recoverPassword = async (email: string): Promise<void> => {
    const savedCredentials = localStorage.getItem(`securepass_creds_${email}`);
    
    if (!savedCredentials) {
      throw new Error('No account found with this email address');
    }

    // In a real app, this would send an email
    // For demo purposes, we'll just show a success message
    addLog(`Password recovery requested for ${email}`);
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return {
    user,
    login,
    register,
    logout,
    recoverPassword,
  };
};