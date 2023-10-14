import { useEffect, useState } from 'react';
import { useNavigate, useParams, useRouteLoaderData } from 'react-router-dom';
import styled from 'styled-components';
import { Address, isAddress, isAddressEqual } from 'viem';

import RevealCommit from './revealCommit';
import WithdrawDeposit from './withdraDeposit';

import { GamePhase, useGameContext } from '../../context/GameContext';
import useCountDown from '../../hooks/useCountDown';
import { GameDetails, getGameOutcome } from '../../utils/readContract';
import { PlayerMove } from '../newGame/types';
import { useWeb3Connection } from '../../context/Web3ConnectionContext';
import Button from '../button';

interface Props {
  winner: Address;
  setWinner: React.Dispatch<React.SetStateAction<Address>>;
}
const PlayerOneMove: React.FC<Props> = ({ winner, setWinner }) => {
  const gameDetails = useRouteLoaderData('game') as GameDetails;
  const { id: gameId } = useParams();
  const navigate = useNavigate();

  const { gamePhase } = useGameContext();
  const { account } = useWeb3Connection();

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
  // console.log({ remainingTime });
  useEffect(() => {
    // if (gamePhase !== GamePhase.GameOver) return;

    (async () => {
      if (
        playedHand === PlayerMove.Null &&
        gameDetails.player2.hand === PlayerMove.Null
      )
        return;
      const [isPlayer1Winner, isPlayer2Winner] = await Promise.all([
        getGameOutcome(playedHand, gameDetails.player2.hand, gameId as Address),
        getGameOutcome(gameDetails.player2.hand, playedHand, gameId as Address),
      ]);
      console.log({ isPlayer1Winner, isPlayer2Winner });
      const isWinner = await getGameOutcome(
        playedHand,
        gameDetails.player2.hand,
        gameId as Address
      );
      console.log({ isWinner });
      setWinner(
        isWinner ? gameDetails.player1.address : gameDetails.player2.address
      );
    })();
  }, [
    gameDetails.player1.address,
    gameDetails.player2.address,
    gameDetails.player2.hand,
    gameId,
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
            hiddenHand={gameDetails.player1.hiddenHand}
            playedHand={playedHand}
            setPlayedHand={setPlayedHand}
          />
        )}
      </>
    ),
    [GamePhase.GameOver]: (
      <>
        {winner === gameDetails.player1.address ? (
          <>
            <h3>Congrads! You won 🎉</h3>
            <p>Your Rewards are En Route!</p>
            <Button size='small' onClick={() => navigate('/')}>
              New game
            </Button>
          </>
        ) : (
          <>
            <h3>Player 2 swiped your Ethers 😔</h3>
            <p>Keep calm and take a shot again</p>
            <Button size='small' onClick={() => navigate('/')}>
              New game
            </Button>
          </>
        )}
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
