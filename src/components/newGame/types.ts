import { Address } from 'viem';

export enum PlayerMove {
  Null = 0,
  Rock = 1,
  Paper = 2,
  Scissors = 3,
  Spock = 4,
  Lizard = 5,
}
export type GameFormState = {
  move: PlayerMove;
  player2Address: Address | string;
  stake: string;
};
