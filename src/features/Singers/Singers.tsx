import React from 'react';
import { ActionButton, EmptyState } from '../../components/common';
import { useSingers } from '../../hooks';
import { useAppSelector } from '../../redux';
import { selectSingers } from '../../redux';
import { formatDate } from '../../utils/dataProcessing';

const Singers: React.FC = () => {
  const {
    singers,
    isAdmin,
    handleRemoveSinger,
  } = useSingers();

  const singersData = useAppSelector(selectSingers);
  const singersCount = Object.keys(singersData).length;

  // Debug logging
  console.log('Singers component - singers count:', singersCount);
  console.log('Singers component - singers:', singers);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Singers</h1>
        <p className="text-sm text-gray-600">
          {singers.length} singer{singers.length !== 1 ? 's' : ''} in the party
        </p>
        
        {/* Debug info */}
        <div className="mt-2 text-sm text-gray-500">
          Singers loaded: {singersCount}
        </div>
      </div>

      {/* Singers List */}
      <div className="bg-white rounded-lg shadow">
        {singersCount === 0 ? (
          <EmptyState
            title="No singers yet"
            message="Singers will appear here when they join the party"
            icon={
              <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            }
          />
        ) : singers.length === 0 ? (
          <EmptyState
            title="Loading singers..."
            message="Please wait while singers data is being loaded"
            icon={
              <svg className="h-12 w-12 text-gray-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            }
          />
        ) : (
          <div className="divide-y divide-gray-200">
            {singers.map((singer) => (
              <div key={singer.key} className="flex items-center justify-between p-4">
                {/* Singer Info */}
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">
                    {singer.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Last login: {formatDate(singer.lastLogin)}
                  </p>
                </div>

                {/* Admin Controls */}
                {isAdmin && (
                  <div className="flex-shrink-0 ml-4">
                    <ActionButton
                      onClick={() => handleRemoveSinger(singer)}
                      variant="danger"
                      size="sm"
                    >
                      Remove
                    </ActionButton>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Singers; 