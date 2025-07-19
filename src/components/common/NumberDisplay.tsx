import React from 'react';

interface NumberDisplayProps {
  number: number;
  className?: string;
}

export const NumberDisplay: React.FC<NumberDisplayProps> = ({ 
  number, 
  className = '' 
}) => {
  return (
    <div slot="start" className={`ion-text-center ${className}`} style={{ marginLeft: '-8px', marginRight: '12px' }}>
      <div className="ion-text-bold ion-color-medium" style={{ fontSize: '1rem', minWidth: '2rem' }}>
        {number}
      </div>
    </div>
  );
}; 