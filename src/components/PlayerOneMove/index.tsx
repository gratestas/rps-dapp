import { useEffect, useState } from 'react';
import { useNavigate, useParams, useRouteLoaderData } from 'react-router-dom';
import styled from 'styled-components';
import { Address, Hash, isAddressEqual } from 'viem';

import RevealCommit from './revealCommit';
import WithdrawDeposit from './withdraDeposit';
import Button from '../button';

import {
  GameDetails,
  GamePhase,
  useGameContext,
} from '../../context/GameContext';
import { useWeb3Connection } from '../../context/Web3ConnectionContext';
import useCountDown from '../../hooks/useCountDown';
import { PlayerMove } from '../newGame/types';

const PlayerOneMove: React.FC = () => {
  const gameDetails = useRouteLoaderData('game') as GameDetails;
  const { id: gameId } = useParams();
  const navigate = useNavigate();

  const { gamePhase, setGameOutcome, outcome } = useGameContext();
  const { account } = useWeb3Connection();

  const storedPlayedHand = localStorage.getItem('playedHand');
  const [playedHand, setPlayedHand] = useState<PlayerMove>(
    storedPlayedHand ? JSON.parse(storedPlayedHand) : PlayerMove.Null
  );

  const remainingTime = useCountDown({
    lastAction: Number(gameDetails.lastAction),
    timeout: Number(gameDetails.timeout),
  });

  useEffect(() => {
    if (gamePhase !== GamePhase.GameOver) return;

    (async () => {
      /*    if (
        playedHand === PlayerMove.Null &&
        gameDetails.player2.hand === PlayerMove.Null
      )
        return; */
      console.log({ playedHand });
      console.log('plyaer2 hand', gameDetails.player2.hand);
      await setGameOutcome(playedHand, gameId as Hash, gameDetails);
    })();
  }, [
    gameDetails,
    gameDetails.player1.address,
    gameDetails.player2.address,
    gameDetails.player2.hand,
    gameId,
    gamePhase,
    playedHand,
    setGameOutcome,
  ]);

  const renderMap = {
    [GamePhase.PlayerTwoPlaying]: (
      <>
        {remainingTime === 0 ? (
          gameDetails.stake > 0 ? (
            <WithdrawDeposit />
          ) : (
            <>
              <p>You have withdrawn your deposit</p>
              <Button size='small' onClick={() => navigate('/')}>
                New game
              </Button>
            </>
          )
        ) : (
          <div>Awaiting Player 2's move</div>
        )}
      </>
    ),
    [GamePhase.Reveal]: (
      <>
        {remainingTime === 0 ? (
          <>
            <h3>No Moves. No Victory.</h3>
            <p>You didn't reveal the commit on time. Player 2 won.</p>
          </>
        ) : (
          <RevealCommit
            hiddenHand={gameDetails.player1.hiddenHand as Hash}
            playedHand={playedHand}
            setPlayedHand={setPlayedHand}
          />
        )}
      </>
    ),
    [GamePhase.GameOver]: (
      <>
        {outcome.isPlayer1Winner && (
          <>
            <h3>Congrads! You won 🎉</h3>
            <p>Your Rewards are En Route!</p>
            <Button size='small' onClick={() => navigate('/')}>
              New game
            </Button>
          </>
        )}
        {outcome.isPlayer2Winner && (
          <>
            <h3>Player 2 swiped your Ethers 😔</h3>
            <p>Keep calm and take a shot again</p>
            <Button size='small' onClick={() => navigate('/')}>
              New game
            </Button>
          </>
        )}
        {outcome.isTie && <div>It's a tie</div>}
      </>
    ),
  };

  if (account && !isAddressEqual(gameDetails.player1.address, account))
    return null;
  return (
    <Container>{remainingTime !== null && renderMap[gamePhase]}</Container>
  );
};

export default PlayerOneMove;

const Container = styled.div`
  margin-top: 3rem;
`;
