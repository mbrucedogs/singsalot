import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div style={{ marginBottom: '24px', paddingLeft: '16px' }}>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
        {subtitle && (
          <p className="text-sm text-gray-600">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default PageHeader; 