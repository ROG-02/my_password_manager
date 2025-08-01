import React, { useState, useEffect } from 'react';
import { Key, Database, Bot, Plus, Search, Download, Upload, Activity } from 'lucide-react';
import { usePasswordManager } from '../hooks/usePasswordManager';
import { useBackupCodes } from '../hooks/useBackupCodes';
import { useAICredentials } from '../hooks/useAICredentials';
import { useAuditLog } from '../hooks/useAuditLog';
import PasswordStrengthIndicator from './common/PasswordStrengthIndicator';

interface DashboardProps {
  onNavigate: (section: 'passwords' | 'backup-codes' | 'ai-credentials') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { passwords } = usePasswordManager();
  const { backupCodes } = useBackupCodes();
  const { aiCredentials } = useAICredentials();
  const { logs } = useAuditLog();

  // Calculate stats
  const totalEntries = passwords.length + backupCodes.length + aiCredentials.length;
  const weakPasswords = passwords.filter(p => {
    const strength = calculatePasswordStrength(p.password);
    return strength < 60;
  }).length;
  
  const recentActivity = logs.slice(0, 5);

  // Filter all entries based on search term
  const filteredPasswords = passwords.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.website.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBackupCodes = backupCodes.filter(bc =>
    bc.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bc.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAICredentials = aiCredentials.filter(ai =>
    ai.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ai.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculatePasswordStrength = (password: string): number => {
    let score = 0;
    
    if (password.length >= 8) score += 25;
    if (password.length >= 12) score += 25;
    if (/[a-z]/.test(password)) score += 10;
    if (/[A-Z]/.test(password)) score += 10;
    if (/[0-9]/.test(password)) score += 10;
    if (/[^A-Za-z0-9]/.test(password)) score += 20;
    
    return Math.min(score, 100);
  };

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    onClick?: () => void;
  }> = ({ title, value, icon, color, onClick }) => (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${
        onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Overview of your secure credentials and recent activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Entries"
          value={totalEntries}
          icon={<Key className="w-6 h-6 text-white" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Passwords"
          value={passwords.length}
          icon={<Key className="w-6 h-6 text-white" />}
          color="bg-green-500"
          onClick={() => onNavigate('passwords')}
        />
        <StatCard
          title="Backup Codes"
          value={backupCodes.length}
          icon={<Database className="w-6 h-6 text-white" />}
          color="bg-purple-500"
          onClick={() => onNavigate('backup-codes')}
        />
        <StatCard
          title="AI Credentials"
          value={aiCredentials.length}
          icon={<Bot className="w-6 h-6 text-white" />}
          color="bg-orange-500"
          onClick={() => onNavigate('ai-credentials')}
        />
      </div>

      {/* Security Alert */}
      {weakPasswords > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Activity className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Security Alert
              </h3>
              <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                <p>
                  You have {weakPasswords} weak password{weakPasswords !== 1 ? 's' : ''} that should be updated for better security.
                </p>
              </div>
              <div className="mt-3">
                <button
                  onClick={() => onNavigate('passwords')}
                  className="bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-md text-sm font-medium hover:bg-yellow-200 dark:hover:bg-yellow-700 transition-colors"
                >
                  Review Passwords
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Search</h2>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search across all your entries..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Search Results */}
        {searchTerm && (
          <div className="mt-6 space-y-4">
            {filteredPasswords.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Passwords ({filteredPasswords.length})
                </h3>
                <div className="space-y-2">
                  {filteredPasswords.slice(0, 3).map((password) => (
                    <div key={password.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Key className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{password.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{password.username}</p>
                        </div>
                      </div>
                      <PasswordStrengthIndicator password={password.password} size="sm" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filteredBackupCodes.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Backup Codes ({filteredBackupCodes.length})
                </h3>
                <div className="space-y-2">
                  {filteredBackupCodes.slice(0, 3).map((code) => (
                    <div key={code.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Database className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{code.service}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{code.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filteredAICredentials.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  AI Credentials ({filteredAICredentials.length})
                </h3>
                <div className="space-y-2">
                  {filteredAICredentials.slice(0, 3).map((credential) => (
                    <div key={credential.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Bot className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{credential.service}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{credential.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filteredPasswords.length === 0 && filteredBackupCodes.length === 0 && filteredAICredentials.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No entries found matching "{searchTerm}"
              </p>
            )}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
        {recentActivity.length > 0 ? (
          <div className="space-y-3">
            {recentActivity.map((log) => (
              <div key={log.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Activity className="w-4 h-4 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">{log.action}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{log.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
            No recent activity to display
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;