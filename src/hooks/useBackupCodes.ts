import { useState, useEffect } from 'react';
import { encrypt, decrypt } from '../utils/encryption';
import { useAuditLog } from './useAuditLog';

export interface BackupCodeEntry {
  id: string;
  service: string;
  codes: string[];
  description: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'securepass_backup_codes';

export const useBackupCodes = () => {
  const [backupCodes, setBackupCodes] = useState<BackupCodeEntry[]>([]);
  const { addLog } = useAuditLog();

  useEffect(() => {
    loadBackupCodes();
  }, []);

  const loadBackupCodes = async () => {
    try {
      const encrypted = localStorage.getItem(STORAGE_KEY);
      if (encrypted) {
        const decrypted = await decrypt(encrypted);
        setBackupCodes(JSON.parse(decrypted));
      }
    } catch (error) {
      console.error('Failed to load backup codes:', error);
      setBackupCodes([]);
    }
  };

  const saveBackupCodes = async (newBackupCodes: BackupCodeEntry[]) => {
    try {
      const encrypted = await encrypt(JSON.stringify(newBackupCodes));
      localStorage.setItem(STORAGE_KEY, encrypted);
      setBackupCodes(newBackupCodes);
    } catch (error) {
      console.error('Failed to save backup codes:', error);
      throw new Error('Failed to save backup codes');
    }
  };

  const addBackupCode = async (codeData: Omit<BackupCodeEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newBackupCode: BackupCodeEntry = {
      ...codeData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedBackupCodes = [...backupCodes, newBackupCode];
    await saveBackupCodes(updatedBackupCodes);
    addLog(`Added backup codes for: ${codeData.service}`);
    return newBackupCode;
  };

  const updateBackupCode = async (id: string, codeData: Partial<BackupCodeEntry>) => {
    const updatedBackupCodes = backupCodes.map(code =>
      code.id === id
        ? { ...code, ...codeData, updatedAt: new Date().toISOString() }
        : code
    );

    await saveBackupCodes(updatedBackupCodes);
    addLog(`Updated backup codes for: ${codeData.service || 'Unknown'}`);
  };

  const deleteBackupCode = async (id: string) => {
    const codeToDelete = backupCodes.find(c => c.id === id);
    const updatedBackupCodes = backupCodes.filter(code => code.id !== id);
    await saveBackupCodes(updatedBackupCodes);
    addLog(`Deleted backup codes for: ${codeToDelete?.service || 'Unknown'}`);
  };

  const exportBackupCodes = () => {
    addLog('Exported backup codes');
    return backupCodes;
  };

  return {
    backupCodes,
    addBackupCode,
    updateBackupCode,
    deleteBackupCode,
    exportBackupCodes,
  };
};