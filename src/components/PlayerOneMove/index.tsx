import { useEffect, useState } from 'react';
import { useParams, useRouteLoaderData } from 'react-router-dom';
import styled from 'styled-components';
import { Address } from 'viem';

import { PlayerMove } from '../newGame';
import RevealCommit from './revealCommit';
import WithdrawDeposit from './withdraDeposit';

import { GamePhase, useGameContext } from '../../context/GameContext';
import useCountDown from '../../hooks/useCountDown';
import { GameDetails, getGameOutcome } from '../../utils/readContract';

interface Props {
  winner: Address;
  setWinner: React.Dispatch<React.SetStateAction<Address>>;
}
const PlayerOneMove: React.FC<Props> = ({ winner, setWinner }) => {
  const gameDetails = useRouteLoaderData('game') as GameDetails;
  const { id: gameId } = useParams();
  const { gamePhase } = useGameContext();

  const storedPlayedHand = localStorage.getItem('playedHand');
  const [playedHand, setPlayedHand] = useState<PlayerMove>(
    storedPlayedHand ? JSON.parse(storedPlayedHand) : PlayerMove.Null
  );

  const remainingTime = useCountDown({
    lastAction: Number(gameDetails.lastAction),
    timeout: Number(gameDetails.timeout),
  });

  //TODO: check the below condition later
  /*   var remainingTime = 1;
  var didPlayerTwoPlay = true;
  var gameDetailsstake = 1; */
  useEffect(() => {
    if (gamePhase !== GamePhase.GameOver) return;
    if (gameDetails.stake > 0) return;
    (async () => {
      console.log({ playedHand });
      const isWinner = await getGameOutcome(
        playedHand,
        gameDetails.player2.hand,
        gameId as Address
      );
      setWinner(
        isWinner ? gameDetails.player1.address : gameDetails.player2.address
      );
    })();
  }, [
    gameDetails.player1.address,
    gameDetails.player2.address,
    gameDetails.player2.hand,
    gameDetails.stake,
    gameId,
    gamePhase,
    playedHand,
    setWinner,
  ]);

  const renderMap = {
    [GamePhase.PlayerTwoPlaying]: (
      <>
        {remainingTime === 0 ? (
          gameDetails.stake > 0 ? (
            <WithdrawDeposit />
          ) : (
            <div>You have withdrawn your deposit</div>
          )
        ) : (
          <div>Awaiting Player 2's move</div>
        )}
      </>
    ),
    [GamePhase.Reveal]: (
      <>
        {remainingTime === 0 ? (
          <div>You didn't reveal the commit on time. Player 2 won.</div>
        ) : (
          <RevealCommit playedHand={playedHand} setPlayedHand={setPlayedHand} />
        )}
      </>
    ),
    [GamePhase.GameOver]: (
      <>
        {winner === gameDetails.player1.address ? (
          <div>Your deposit and rewards have been sent to you.</div>
        ) : (
          <div>
            Player 2 grabbed your stake. Keep calm and take a shot again.
          </div>
        )}
      </>
    ),
  };

  return <Container>{renderMap[gamePhase]}</Container>;
};

export default PlayerOneMove;

const Container = styled.div`
  margin-top: 3rem;
`;
