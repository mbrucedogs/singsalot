import { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../redux';
import { selectSingersArray, selectIsAdmin, selectControllerName } from '../redux';
import { addSinger, removeSinger } from '../redux/controllerSlice';
import { useToast } from './useToast';
import type { Singer } from '../types';

export const useSingers = () => {
  const singers = useAppSelector(selectSingersArray);
  const isAdmin = useAppSelector(selectIsAdmin);
  const controllerName = useAppSelector(selectControllerName);
  const dispatch = useAppDispatch();
  const toast = useToast();
  const showSuccess = toast?.showSuccess;
  const showError = toast?.showError;

  const handleRemoveSinger = useCallback(async (singer: Singer) => {
    if (!isAdmin) {
      showError && showError('Only admins can remove singers');
      return;
    }

    if (!controllerName) {
      showError && showError('Controller not found');
      return;
    }

    try {
      await dispatch(removeSinger({ controllerName, singerName: singer.name })).unwrap();
      showSuccess && showSuccess(`${singer.name} removed from singers list and queue`);
    } catch (error) {
      console.error('Failed to remove singer:', error);
      showError && showError('Failed to remove singer');
    }
  }, [isAdmin, controllerName, dispatch, showSuccess, showError]);

  const handleAddSinger = useCallback(async (singerName: string) => {
    if (!isAdmin) {
      showError && showError('Only admins can add singers');
      return;
    }

    if (!controllerName) {
      showError && showError('Controller not found');
      return;
    }

    if (!singerName.trim()) {
      showError && showError('Singer name cannot be empty');
      return;
    }

    try {
      await dispatch(addSinger({ controllerName, singerName: singerName.trim() })).unwrap();
      showSuccess && showSuccess(`${singerName} added to singers list`);
    } catch (error) {
      console.error('Failed to add singer:', error);
      if (error instanceof Error && error.message === 'Singer already exists') {
        showError && showError('Singer already exists');
      } else {
        showError && showError('Failed to add singer');
      }
    }
  }, [isAdmin, controllerName, dispatch, showSuccess, showError]);

  return {
    singers,
    isAdmin,
    handleRemoveSinger,
    handleAddSinger,
  };
}; 