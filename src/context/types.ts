import { Address, Hash } from 'viem';

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

export type GameOutcome = {
  isPlayer1Winner: boolean | null;
  isPlayer2Winner: boolean | null;
  isTie: boolean | null;
};
