import { useState, useEffect } from 'react';

export interface AuditLogEntry {
  id: string;
  action: string;
  timestamp: string;
  details?: string;
}

const STORAGE_KEY = 'securepass_audit_log';
const MAX_LOG_ENTRIES = 1000;

export const useAuditLog = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = () => {
    try {
      const savedLogs = localStorage.getItem(STORAGE_KEY);
      if (savedLogs) {
        setLogs(JSON.parse(savedLogs));
      }
    } catch (error) {
      console.error('Failed to load audit logs:', error);
      setLogs([]);
    }
  };

  const saveLogs = (newLogs: AuditLogEntry[]) => {
    try {
      // Keep only the most recent entries
      const trimmedLogs = newLogs.slice(-MAX_LOG_ENTRIES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedLogs));
      setLogs(trimmedLogs);
    } catch (error) {
      console.error('Failed to save audit logs:', error);
    }
  };

  const addLog = (action: string, details?: string) => {
    const newLog: AuditLogEntry = {
      id: crypto.randomUUID(),
      action,
      details,
      timestamp: new Date().toLocaleString(),
    };

    const updatedLogs = [...logs, newLog];
    saveLogs(updatedLogs);
  };

  const clearLogs = () => {
    localStorage.removeItem(STORAGE_KEY);
    setLogs([]);
  };

  return {
    logs,
    addLog,
    clearLogs,
  };
};