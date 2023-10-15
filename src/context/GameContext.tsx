import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import { Address, Hash } from 'viem';

import useLocalStorage from '../hooks/useLocalStorage';
import { PlayerMove } from '../components/newGame/types';
import { checkIfPlayerWinner, getGameDetails } from '../utils/readContract';
import { publicClient } from '../config/provider';
import { rpsContract } from '../data/config';
import { useParams } from 'react-router-dom';

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
  updateGamePhase: () => Promise<void>;
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

  const { id: gameId } = useParams();
  const [fetchedGamePhase, setFetchedGamePhase] = useState<GamePhase>(
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

  const updateGamePhase = useCallback(async () => {
    const gameDetails = await getGameDetails(gameId as Address);
    console.log({ gameDetails });

    let gamePhase_ = GamePhase.PlayerTwoPlaying;

    if (!!gameDetails.player1.hiddenHand && !!gameDetails.player2.hand)
      gamePhase_ = GamePhase.Reveal;

    if (
      !!gameDetails.player1.hiddenHand &&
      !!gameDetails.player2.hand &&
      Number(gameDetails.stake) === 0
    )
      gamePhase_ = GamePhase.GameOver;
    console.log({ gamePhase_ });
    setFetchedGamePhase(gamePhase_);
  }, [gameId]);

  useEffect(() => {
    (async () => {
      await updateGamePhase();
    })();
  }, [updateGamePhase]);

  console.log({ fetchedGamePhase });

  return (
    <GameContext.Provider
      value={{
        gamePhase,
        updateGamePhase,
        setGamePhase,
        outcome,
        setGameOutcome,
      }}
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
