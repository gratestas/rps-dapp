import React, { createContext, useState, useContext } from 'react';
import { Address, Hash } from 'viem';

import useLocalStorage from '../hooks/useLocalStorage';
import { PlayerMove } from '../components/newGame/types';
import { checkIfPlayerWinner } from '../utils/readContract';

export type Player = {
  address: Address;
  hiddenHand?: Hash;
  hand?: number;
};

export type GameDetails = {
  player1: Player & { hiddenHand: Hash };
  player2: Player & { hand: number };
  stake: bigint;
  lastAction: bigint;
  timeout: bigint;
};

export enum GamePhase {
  PlayerTwoPlaying,
  Reveal,
  GameOver,
}

interface GameContextProps {
  gamePhase: GamePhase;
  outcome: GameOutcome;
  setGameOutcome: (
    playedHand: PlayerMove,
    gameId: Address,
    gameDetails: GameDetails
  ) => Promise<void>;
  setGamePhase: React.Dispatch<React.SetStateAction<GamePhase>>;
}

export type GameOutcome = {
  isPlayer1Winner: boolean | null;
  isPlayer2Winner: boolean | null;
  isTie: boolean | null;
};

const GameContext = createContext<GameContextProps | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [gamePhase, setGamePhase] = useLocalStorage<GamePhase>(
    'gamePhase',
    GamePhase.PlayerTwoPlaying
  );

  const [outcome, setOutcome] = useState<GameOutcome>({
    isPlayer1Winner: null,
    isPlayer2Winner: null,
    isTie: null,
  });

  const setGameOutcome = async (
    playedHand: PlayerMove,
    gameId: Address,
    gameDetails: GameDetails
  ) => {
    if (
      outcome.isPlayer1Winner !== null ||
      outcome.isPlayer2Winner !== null ||
      outcome.isTie !== null
    )
      return;
    const [isPlayer1Winner, isPlayer2Winner] = await Promise.all([
      checkIfPlayerWinner(playedHand, gameDetails.player2.hand, gameId),
      checkIfPlayerWinner(gameDetails.player2.hand, playedHand, gameId),
    ]);
    console.log({ isPlayer1Winner, isPlayer2Winner });

    const isTie = !isPlayer1Winner && !isPlayer2Winner;
    setOutcome({
      isPlayer1Winner,
      isPlayer2Winner,
      isTie,
    });
  };

  return (
    <GameContext.Provider
      value={{ gamePhase, setGamePhase, outcome, setGameOutcome }}
    >
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
