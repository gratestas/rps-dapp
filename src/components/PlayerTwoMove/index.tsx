import styled from 'styled-components';
import { useNavigate, useRouteLoaderData } from 'react-router-dom';
import { Address, isAddressEqual } from 'viem';

import { GamePhase, useGameContext } from '../../context/GameContext';
import { GameDetails } from '../../utils/readContract';
import useCountDown from '../../hooks/useCountDown';

import JoinGame from './joinGame';
import WithdrawReward from './withdrawReward';
import { useWeb3Connection } from '../../context/Web3ConnectionContext';
import Button from '../button';

const PlayerTwoMove: React.FC<{ winner: Address }> = ({ winner }) => {
  const gameDetails = useRouteLoaderData('game') as GameDetails;
  const navigate = useNavigate();

  const { gamePhase } = useGameContext();
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
        {winner === gameDetails.player2.address ? (
          <>
            <h3>Congrads! You won 🎉</h3>
            <p>Your Rewards are En Route!</p>
            <Button size='small' onClick={() => navigate('/')}>
              New game
            </Button>
          </>
        ) : (
          <>
            <h3>Player 1 swiped your Ethers 😔</h3>
            <p>Keep calm and take a shot again!</p>
            <Button size='small' onClick={() => navigate('/')}>
              Create your game
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
