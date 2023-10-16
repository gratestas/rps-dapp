import styled from 'styled-components';
import { useNavigate, useRouteLoaderData } from 'react-router-dom';
import { isAddressEqual } from 'viem';

import JoinGame from './joinGame';
import WithdrawReward from './withdrawReward';
import Button from '../button';

import { useGameContext } from '../../context/GameContext';
import { GameDetails, GamePhase } from '../../context/types';

import useCountDown from '../../hooks/useCountDown';
import { useWeb3Connection } from '../../context/Web3ConnectionContext';

const PlayerTwoMove: React.FC = () => {
  const gameDetails = useRouteLoaderData('game') as GameDetails;
  const navigate = useNavigate();

  const { gamePhase, outcome } = useGameContext();
  const { account } = useWeb3Connection();

  const remainingTime = useCountDown({
    lastAction: Number(gameDetails.lastAction),
    timeout: Number(gameDetails.timeout),
  });

  const renderMap = {
    [GamePhase.PlayerTwoPlaying]: (
      <>
        {remainingTime === 0 ? (
          <div>Sorry, you didn't play on time</div>
        ) : (
          <JoinGame />
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
        {outcome.isPlayer2Winner && (
          <>
            <h3>Congrads! You won 🎉</h3>
            <p>Your Rewards are En Route!</p>
            <Button size='small' onClick={() => navigate('/')}>
              New game
            </Button>
          </>
        )}
        {outcome.isPlayer1Winner && (
          <>
            <h3>Player 1 swiped your Ethers 😔</h3>
            <p>Keep calm and take a shot again!</p>
            <Button size='small' onClick={() => navigate('/')}>
              Create your game
            </Button>
          </>
        )}
        {outcome.isTie && (
          <>
            <div style={{ marginBottom: '10px' }}>It's a tie</div>
            <Button size='small' onClick={() => navigate('/')}>
              New game
            </Button>
          </>
        )}
      </>
    ),
  };
  if (account && !isAddressEqual(gameDetails.player2.address, account))
    return null;
  return (
    <Container>{remainingTime !== null && renderMap[gamePhase]}</Container>
  );
};

export default PlayerTwoMove;

const Container = styled.div`
  margin-top: 3rem;
`;
