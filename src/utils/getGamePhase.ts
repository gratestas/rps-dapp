import { GamePhase } from '../context/types';

export const getGamePhase = (player2Hand: number, stake: number) => {
  let gamePhase = GamePhase.PlayerTwoPlaying;

  if (player2Hand) gamePhase = GamePhase.Reveal;
  if (player2Hand && stake === 0) gamePhase = GamePhase.GameOver;

  return gamePhase;
};
