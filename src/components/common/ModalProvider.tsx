import React, { useState, useCallback } from 'react';
import { ModalContext } from '../../contexts/ModalContext';
import { ModalType, type ModalViewType, type ModalState, type ModalItem } from '../../types/modal';
import SongInfo from './SongInfo';
import SelectSinger from './SelectSinger';
import type { Song } from '../../types';

interface ModalProviderProps {
  children: React.ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modalState, setModalState] = useState<ModalState>({
    stack: [],
  });

  const openModal = useCallback((type: ModalViewType, data: Song): string => {
    const id = Math.random().toString(36).substr(2, 9);
    const newModal: ModalItem = {
      id,
      type,
      data,
      isOpen: true,
    };
    
    setModalState(prev => ({
      stack: [...prev.stack, newModal],
    }));
    
    return id;
  }, []);

  const closeModal = useCallback((id: string) => {
    setModalState(prev => ({
      stack: prev.stack.filter(modal => modal.id !== id),
    }));
  }, []);

  const closeTopModal = useCallback(() => {
    setModalState(prev => ({
      stack: prev.stack.slice(0, -1),
    }));
  }, []);

  const openSongInfo = useCallback((song: Song): string => {
    return openModal(ModalType.SONG_INFO, song);
  }, [openModal]);

  const openSelectSinger = useCallback((song: Song): string => {
    return openModal(ModalType.SELECT_SINGER, song);
  }, [openModal]);

  const contextValue = {
    openModal,
    closeModal,
    closeTopModal,
    openSongInfo,
    openSelectSinger,
    modalState,
  };

  // Render all modals in the stack
  const renderModals = () => {
    return modalState.stack.map((modal) => {
      const handleClose = () => closeModal(modal.id);
      
      switch (modal.type) {
        case ModalType.SONG_INFO:
          return (
            <SongInfo
              key={modal.id}
              isOpen={modal.isOpen}
              onClose={handleClose}
              song={modal.data}
            />
          );
        case ModalType.SELECT_SINGER:
          return (
            <SelectSinger
              key={modal.id}
              isOpen={modal.isOpen}
              onClose={handleClose}
              song={modal.data}
            />
          );
        default:
          return null;
      }
    });
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      {renderModals()}
    </ModalContext.Provider>
  );
}; 