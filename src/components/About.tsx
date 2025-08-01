import React from 'react';
import { Shield, Lock, Eye, Key, Database, Bot, CheckCircle } from 'lucide-react';

const About: React.FC = () => {
  const features = [
    {
      icon: <Lock className="w-6 h-6" />,
      title: 'Client-Side Encryption',
      description: 'All sensitive data is encrypted using AES-256-GCM before being stored locally.',
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: 'Zero-Knowledge Architecture',
      description: 'Your data never leaves your device in unencrypted form. We cannot access your passwords.',
    },
    {
      icon: <Key className="w-6 h-6" />,
      title: 'Secure Password Generation',
      description: 'Generate cryptographically secure passwords with customizable complexity requirements.',
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: 'Backup Code Management',
      description: 'Safely store your two-factor authentication backup codes for all your accounts.',
    },
    {
      icon: <Bot className="w-6 h-6" />,
      title: 'AI Credential Storage',
      description: 'Securely manage API keys and credentials for AI services and platforms.',
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: 'Security Auditing',
      description: 'Built-in audit logging tracks all actions for security review and compliance.',
    },
  ];

  const securityPractices = [
    'Client-side encryption using Web Crypto API',
    'PBKDF2 key derivation with 100,000 iterations',
    'Automatic session timeout after inactivity',
    'Secure clipboard handling with auto-clear',
    'Password strength analysis and recommendations',
    'No external data transmission of sensitive information',
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Shield className="w-16 h-16 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          About SecurePass
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          SecurePass is a comprehensive password manager designed with security and privacy as the top priorities. 
          Built using modern web technologies with client-side encryption to ensure your data remains safe and private.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
          >
            <div className="text-blue-600 dark:text-blue-400 mb-4">
              {feature.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* Security Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Security & Privacy
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Security Practices
            </h3>
            <ul className="space-y-2">
              {securityPractices.map((practice, index) => (
                <li key={index} className="flex items-center text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  {practice}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Privacy Commitment
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Your privacy is paramount. SecurePass uses client-side encryption, meaning your data is encrypted 
              on your device before any storage occurs. This ensures that even if someone gained access to your 
              stored data, it would be cryptographically protected.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              We employ a zero-knowledge architecture where your master password and sensitive data never 
              leave your device in plaintext form. This means we literally cannot access your passwords, 
              even if we wanted to.
            </p>
          </div>
        </div>
      </div>

      {/* Technical Details */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Technical Implementation
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Encryption Details
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Algorithm:</span>
                <span className="text-gray-900 dark:text-white font-mono">AES-256-GCM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Key Derivation:</span>
                <span className="text-gray-900 dark:text-white font-mono">PBKDF2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Iterations:</span>
                <span className="text-gray-900 dark:text-white font-mono">100,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Hash Function:</span>
                <span className="text-gray-900 dark:text-white font-mono">SHA-256</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Technology Stack
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Frontend:</span>
                <span className="text-gray-900 dark:text-white font-mono">React + TypeScript</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Styling:</span>
                <span className="text-gray-900 dark:text-white font-mono">Tailwind CSS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Encryption:</span>
                <span className="text-gray-900 dark:text-white font-mono">Web Crypto API</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Storage:</span>
                <span className="text-gray-900 dark:text-white font-mono">Local Storage</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Version Info */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        <p>SecurePass v1.0.0 - Built with security and privacy in mind</p>
      </div>
    </div>
  );
};

export default About;