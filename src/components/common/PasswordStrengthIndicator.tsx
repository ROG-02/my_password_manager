import React from 'react';
import { validatePassword } from '../../utils/validation';

interface PasswordStrengthIndicatorProps {
  password: string;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  size = 'md',
  showDetails = false,
}) => {
  const validation = validatePassword(password);
  
  const getStrengthLabel = (score: number): string => {
    if (score < 30) return 'Very Weak';
    if (score < 50) return 'Weak';
    if (score < 70) return 'Fair';
    if (score < 85) return 'Good';
    return 'Excellent';
  };

  const getStrengthColor = (score: number): string => {
    if (score < 30) return 'bg-red-500';
    if (score < 50) return 'bg-orange-500';
    if (score < 70) return 'bg-yellow-500';
    if (score < 85) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getTextColor = (score: number): string => {
    if (score < 30) return 'text-red-600 dark:text-red-400';
    if (score < 50) return 'text-orange-600 dark:text-orange-400';
    if (score < 70) return 'text-yellow-600 dark:text-yellow-400';
    if (score < 85) return 'text-blue-600 dark:text-blue-400';
    return 'text-green-600 dark:text-green-400';
  };

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  if (!password) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className={`font-medium ${getTextColor(validation.score)} ${textSizeClasses[size]}`}>
          {getStrengthLabel(validation.score)}
        </span>
        <span className={`${textSizeClasses[size]} text-gray-500 dark:text-gray-400`}>
          {validation.score}%
        </span>
      </div>
      
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`${getStrengthColor(validation.score)} ${sizeClasses[size]} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${validation.score}%` }}
        />
      </div>

      {showDetails && validation.errors.length > 0 && (
        <div className="mt-2">
          <p className={`${textSizeClasses[size]} text-gray-600 dark:text-gray-400 mb-1`}>
            Requirements:
          </p>
          <ul className={`${textSizeClasses[size]} space-y-1`}>
            {validation.errors.map((error, index) => (
              <li key={index} className="text-red-600 dark:text-red-400 flex items-center">
                <span className="w-1 h-1 bg-red-500 rounded-full mr-2 flex-shrink-0" />
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {showDetails && validation.suggestions.length > 0 && (
        <div className="mt-2">
          <p className={`${textSizeClasses[size]} text-gray-600 dark:text-gray-400 mb-1`}>
            Suggestions:
          </p>
          <ul className={`${textSizeClasses[size]} space-y-1`}>
            {validation.suggestions.map((suggestion, index) => (
              <li key={index} className="text-blue-600 dark:text-blue-400 flex items-center">
                <span className="w-1 h-1 bg-blue-500 rounded-full mr-2 flex-shrink-0" />
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;