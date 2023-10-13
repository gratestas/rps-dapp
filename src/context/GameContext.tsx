import React, { createContext, useState, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

export enum GamePhase {
  PlayerTwoPlaying,
  Reveal,
  GameOver,
}

interface GameContextProps {
  gamePhase: GamePhase;
  setGamePhase: React.Dispatch<React.SetStateAction<GamePhase>>;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [gamePhase, setGamePhase] = useLocalStorage<GamePhase>(
    'gamePhase',
    GamePhase.PlayerTwoPlaying
  );

  return (
    <GameContext.Provider value={{ gamePhase, setGamePhase }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};
