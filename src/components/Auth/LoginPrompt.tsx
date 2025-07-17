import { useState } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { setAuth } from '../../redux/authSlice';
import type { Authentication } from '../../types';

interface LoginPromptProps {
  isAdmin: boolean;
  onComplete: () => void;
}

const LoginPrompt: React.FC<LoginPromptProps> = ({ isAdmin, onComplete }) => {
  const [singerName, setSingerName] = useState(isAdmin ? 'Admin' : '');
  const [partyId, setPartyId] = useState('');
  const [error, setError] = useState('');
  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partyId.trim() || !singerName.trim()) {
      setError('Please enter both Party Id and your name.');
      return;
    }
    setError('');
    const auth: Authentication = {
      authenticated: true,
      singer: singerName.trim(),
      isAdmin: isAdmin,
      controller: partyId.trim(),
    };
    dispatch(setAuth(auth));
    onComplete();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to Karaoke! 🎤
          </h1>
          <p className="text-gray-600">
            {isAdmin ? 'You have admin privileges' : 'Enter your Party Id and name to get started'}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="partyId" className="block text-sm font-medium text-gray-700 mb-1">
              Party Id
            </label>
            <input
              type="text"
              id="partyId"
              value={partyId}
              onChange={(e) => setPartyId(e.target.value)}
              placeholder="Enter your Party Id"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              autoFocus
            />
          </div>
          <div>
            <label htmlFor="singerName" className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              id="singerName"
              value={singerName}
              onChange={(e) => setSingerName(e.target.value)}
              placeholder={isAdmin ? 'Admin' : 'Enter your name'}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            {isAdmin ? 'Start as Admin' : 'Join Session'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPrompt; 