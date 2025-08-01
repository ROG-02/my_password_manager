import { useState, useEffect } from 'react';
import { encrypt, decrypt } from '../utils/encryption';
import { useAuditLog } from './useAuditLog';

export interface PasswordEntry {
  id: string;
  title: string;
  username: string;
  password: string;
  website: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'securepass_passwords';

export const usePasswordManager = () => {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const { addLog } = useAuditLog();

  useEffect(() => {
    loadPasswords();
  }, []);

  const loadPasswords = async () => {
    try {
      const encrypted = localStorage.getItem(STORAGE_KEY);
      if (encrypted) {
        const decrypted = await decrypt(encrypted);
        setPasswords(JSON.parse(decrypted));
      }
    } catch (error) {
      console.error('Failed to load passwords:', error);
      setPasswords([]);
    }
  };

  const savePasswords = async (newPasswords: PasswordEntry[]) => {
    try {
      const encrypted = await encrypt(JSON.stringify(newPasswords));
      localStorage.setItem(STORAGE_KEY, encrypted);
      setPasswords(newPasswords);
    } catch (error) {
      console.error('Failed to save passwords:', error);
      throw new Error('Failed to save password');
    }
  };

  const addPassword = async (passwordData: Omit<PasswordEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPassword: PasswordEntry = {
      ...passwordData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedPasswords = [...passwords, newPassword];
    await savePasswords(updatedPasswords);
    addLog(`Added password entry: ${passwordData.title}`);
    return newPassword;
  };

  const updatePassword = async (id: string, passwordData: Partial<PasswordEntry>) => {
    const updatedPasswords = passwords.map(password =>
      password.id === id
        ? { ...password, ...passwordData, updatedAt: new Date().toISOString() }
        : password
    );

    await savePasswords(updatedPasswords);
    addLog(`Updated password entry: ${passwordData.title || 'Unknown'}`);
  };

  const deletePassword = async (id: string) => {
    const passwordToDelete = passwords.find(p => p.id === id);
    const updatedPasswords = passwords.filter(password => password.id !== id);
    await savePasswords(updatedPasswords);
    addLog(`Deleted password entry: ${passwordToDelete?.title || 'Unknown'}`);
  };

  const importPasswords = async (data: PasswordEntry[]) => {
    const validPasswords = data.filter(item => 
      item.title && item.username && item.password
    ).map(item => ({
      ...item,
      id: item.id || crypto.randomUUID(),
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    const updatedPasswords = [...passwords, ...validPasswords];
    await savePasswords(updatedPasswords);
    addLog(`Imported ${validPasswords.length} password entries`);
    return validPasswords.length;
  };

  const exportPasswords = () => {
    addLog('Exported password entries');
    return passwords;
  };

  return {
    passwords,
    addPassword,
    updatePassword,
    deletePassword,
    importPasswords,
    exportPasswords,
  };
};