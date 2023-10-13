import styled from 'styled-components';
import { useRouteLoaderData } from 'react-router-dom';
import { Address } from 'viem';

import { GamePhase, useGameContext } from '../../context/GameContext';
import { GameDetails } from '../../utils/readContract';
import useCountDown from '../../hooks/useCountDown';

import JoinGame from './joinGame';
import WithdrawReward from './withdrawReward';

//const rpsAddress = '0x215B2434F08EF39dFeadEE92e4eB999B3E6c6306';

const PlayerTwoMove: React.FC<{ winner: Address }> = ({ winner }) => {
  const gameDetails = useRouteLoaderData('game') as GameDetails;
  const { gamePhase } = useGameContext();

  const remainingTime = useCountDown({
    lastAction: Number(gameDetails.lastAction),
    timeout: Number(gameDetails.timeout),
  });

  const renderMap = {
    [GamePhase.PlayerTwoPlaying]: (
      <>
        {remainingTime > 0 ? (
          <JoinGame />
        ) : (
          <div>Sorry, you didn't play on time</div>
        )}
      </>
    ),
    [GamePhase.Reveal]: (
      <>
        {remainingTime === 0 ? (
          gameDetails.stake > 0 ? (
            <WithdrawReward />
          ) : (
            <div>You have withdrawn your reward</div>
          )
        ) : (
          <div>Awaiting Player 1's move</div>
        )}
      </>
    ),
    [GamePhase.GameOver]: (
      <>
        {winner === gameDetails.player2.address ? (
          <>
            <h3>Congrads! You won 🎉</h3>
            <div>Your deposit and reward have been sent to you</div>
          </>
        ) : (
          <div>
            Player 1 grabbed your stake. Keep calm and take a shot again
          </div>
        )}
      </>
    ),
  };
  return <Container>{renderMap[gamePhase]}</Container>;
};

export default PlayerTwoMove;

const Container = styled.div`
  margin-top: 3rem;
`;
