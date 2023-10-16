import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import { useParams } from 'react-router-dom';
import { Address } from 'viem';

import { GameDetails, GameOutcome, GamePhase } from './types';
import { PlayerMove } from '../components/newGame/types';

import { checkIfPlayerWinner, getGameDetails } from '../utils/readContract';
import { getGamePhase } from '../utils/getGamePhase';

interface GameContextProps {
  gamePhase: GamePhase;
  updateGamePhase: () => Promise<void>;
  outcome: GameOutcome;
  setGameOutcome: (
    playedHand: PlayerMove,
    gameId: Address,
    gameDetails: GameDetails
  ) => Promise<void>;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { id: gameId } = useParams();
  const [gamePhase, setGamePhase] = useState<GamePhase>(
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
    const [isPlayer1Winner, isPlayer2Winner_] = await Promise.all([
      checkIfPlayerWinner(playedHand, gameDetails.player2.hand, gameId),
      checkIfPlayerWinner(gameDetails.player2.hand, playedHand, gameId),
    ]);

    const isPlayer2Winner =
      !isPlayer1Winner && playedHand === PlayerMove.Null
        ? true
        : isPlayer2Winner_;
    const isTie = !isPlayer1Winner && !isPlayer2Winner;
    setOutcome({
      isPlayer1Winner,
      isPlayer2Winner,
      isTie,
    });
  };

  const updateGamePhase = useCallback(async () => {
    try {
      const gameDetails = await getGameDetails(gameId as Address);

      const gamePhase_ = getGamePhase(
        gameDetails.player2.hand,
        Number(gameDetails.stake)
      );

      setGamePhase(gamePhase_);
    } catch (error) {
      console.error('GameContext Error updating game phase:', error);
    }
  }, [gameId, setGamePhase]);

  useEffect(() => {
    (async () => {
      await updateGamePhase();
    })();
  }, [updateGamePhase]);

  console.log({ gamePhase });

  return (
    <GameContext.Provider
      value={{
        gamePhase,
        updateGamePhase,
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
