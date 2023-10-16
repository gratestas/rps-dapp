import { PlayerMove } from '../../newGame/types';

export type RevealFormState = {
  move: PlayerMove;
  salt: string | null;
};
