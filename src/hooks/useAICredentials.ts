import { useState, useEffect } from 'react';
import { encrypt, decrypt } from '../utils/encryption';
import { useAuditLog } from './useAuditLog';

export interface AICredentialEntry {
  id: string;
  service: string;
  apiKey: string;
  endpoint?: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'securepass_ai_credentials';

export const useAICredentials = () => {
  const [aiCredentials, setAICredentials] = useState<AICredentialEntry[]>([]);
  const { addLog } = useAuditLog();

  useEffect(() => {
    loadAICredentials();
  }, []);

  const loadAICredentials = async () => {
    try {
      const encrypted = localStorage.getItem(STORAGE_KEY);
      if (encrypted) {
        const decrypted = await decrypt(encrypted);
        setAICredentials(JSON.parse(decrypted));
      }
    } catch (error) {
      console.error('Failed to load AI credentials:', error);
      setAICredentials([]);
    }
  };

  const saveAICredentials = async (newCredentials: AICredentialEntry[]) => {
    try {
      const encrypted = await encrypt(JSON.stringify(newCredentials));
      localStorage.setItem(STORAGE_KEY, encrypted);
      setAICredentials(newCredentials);
    } catch (error) {
      console.error('Failed to save AI credentials:', error);
      throw new Error('Failed to save AI credentials');
    }
  };

  const addAICredential = async (credentialData: Omit<AICredentialEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCredential: AICredentialEntry = {
      ...credentialData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedCredentials = [...aiCredentials, newCredential];
    await saveAICredentials(updatedCredentials);
    addLog(`Added AI credential for: ${credentialData.service}`);
    return newCredential;
  };

  const updateAICredential = async (id: string, credentialData: Partial<AICredentialEntry>) => {
    const updatedCredentials = aiCredentials.map(credential =>
      credential.id === id
        ? { ...credential, ...credentialData, updatedAt: new Date().toISOString() }
        : credential
    );

    await saveAICredentials(updatedCredentials);
    addLog(`Updated AI credential for: ${credentialData.service || 'Unknown'}`);
  };

  const deleteAICredential = async (id: string) => {
    const credentialToDelete = aiCredentials.find(c => c.id === id);
    const updatedCredentials = aiCredentials.filter(credential => credential.id !== id);
    await saveAICredentials(updatedCredentials);
    addLog(`Deleted AI credential for: ${credentialToDelete?.service || 'Unknown'}`);
  };

  const exportAICredentials = () => {
    addLog('Exported AI credentials');
    return aiCredentials;
  };

  return {
    aiCredentials,
    addAICredential,
    updateAICredential,
    deleteAICredential,
    exportAICredentials,
  };
};