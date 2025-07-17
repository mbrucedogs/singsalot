import { useCallback } from 'react';
import { useAppSelector, selectSingersArray, selectIsAdmin } from '../redux';
import { useToast } from './useToast';
import type { Singer } from '../types';

export const useSingers = () => {
  const singers = useAppSelector(selectSingersArray);
  const isAdmin = useAppSelector(selectIsAdmin);
  const { showSuccess, showError } = useToast();

  const handleRemoveSinger = useCallback(async (singer: Singer) => {
    if (!isAdmin) {
      showError('Only admins can remove singers');
      return;
    }

    try {
      // TODO: Implement remove singer functionality
      showSuccess(`${singer.name} removed from singers list`);
    } catch {
      showError('Failed to remove singer');
    }
  }, [isAdmin, showSuccess, showError]);

  return {
    singers,
    isAdmin,
    handleRemoveSinger,
  };
}; 