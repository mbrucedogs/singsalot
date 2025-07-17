import React from 'react';
import type { EmptyStateProps } from '../../types';

const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  message, 
  icon, 
  action 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && (
        <div className="mb-4 text-gray-400">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      {message && (
        <p className="text-sm text-gray-500 mb-4 max-w-sm">
          {message}
        </p>
      )}
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState; 