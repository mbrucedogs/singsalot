import { useCallback } from 'react';
import { useAppSelector, selectSingersArray, selectIsAdmin, selectControllerName } from '../redux';
import { useToast } from './useToast';
import { singerService } from '../firebase/services';
import type { Singer } from '../types';

export const useSingers = () => {
  const singers = useAppSelector(selectSingersArray);
  const isAdmin = useAppSelector(selectIsAdmin);
  const controllerName = useAppSelector(selectControllerName);
  const { showSuccess, showError } = useToast();

  const handleRemoveSinger = useCallback(async (singer: Singer) => {
    if (!isAdmin) {
      showError('Only admins can remove singers');
      return;
    }

    if (!controllerName) {
      showError('Controller not found');
      return;
    }

    try {
      await singerService.removeSinger(controllerName, singer.name);
      showSuccess(`${singer.name} removed from singers list and queue`);
    } catch (error) {
      console.error('Failed to remove singer:', error);
      showError('Failed to remove singer');
    }
  }, [isAdmin, controllerName, showSuccess, showError]);

  const handleAddSinger = useCallback(async (singerName: string) => {
    if (!isAdmin) {
      showError('Only admins can add singers');
      return;
    }

    if (!controllerName) {
      showError('Controller not found');
      return;
    }

    if (!singerName.trim()) {
      showError('Singer name cannot be empty');
      return;
    }

    try {
      await singerService.addSinger(controllerName, singerName.trim());
      showSuccess(`${singerName} added to singers list`);
    } catch (error) {
      console.error('Failed to add singer:', error);
      if (error instanceof Error && error.message === 'Singer already exists') {
        showError('Singer already exists');
      } else {
        showError('Failed to add singer');
      }
    }
  }, [isAdmin, controllerName, showSuccess, showError]);

  return {
    singers,
    isAdmin,
    handleRemoveSinger,
    handleAddSinger,
  };
}; 