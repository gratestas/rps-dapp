import { Address, formatEther, isAddressEqual, zeroAddress } from 'viem';
import {
  LoaderFunction,
  LoaderFunctionArgs,
  useLoaderData,
  useNavigate,
} from 'react-router-dom';

import {
  Badge,
  Card,
  CardContainer,
  Container,
  PlayerInfo,
  Timer,
  Title,
} from './styled';

import { Player, getGameDetails } from '../../utils/readContract';
import { getLabel, shortenAddress } from '../../utils/shortenAddress';
import { convertUnixToDate, formatTime } from '../../utils/time';
import { LoaderData } from './types';
import { useWeb3Connection } from '../../context/Web3ConnectionContext';
import PlayerTwoMove from '../../components/PlayerTwoMove';
import PlayerOneMove from '../../components/PlayerOneMove';
import { useState } from 'react';
import { GamePhase, useGameContext } from '../../context/GameContext';
import useCountDown from '../../hooks/useCountDown';

export const loader = (async ({ params }: LoaderFunctionArgs) => {
  return await getGameDetails(params.id as Address);
}) satisfies LoaderFunction;

const ActiveGame: React.FC = () => {
  const gameDetails = useLoaderData() as LoaderData<typeof loader>;
  const { account } = useWeb3Connection();
  const { gamePhase } = useGameContext();
  const navigate = useNavigate();

  const remainingTime = useCountDown({
    lastAction: Number(gameDetails.lastAction),
    timeout: Number(gameDetails.timeout),
  });

  const playerTurn = {
    [GamePhase.PlayerTwoPlaying]: gameDetails.player2.address,
    [GamePhase.Reveal]: gameDetails.player1.address,
    [GamePhase.GameOver]: zeroAddress,
  };

  const [winner, setWinner] = useState<Address>(zeroAddress);
  const hasWinner = !isAddressEqual(winner, zeroAddress);
  console.log({ winner });
  console.log({ hasWinner });

  const playerCard = (player: Player, isPlayerOne: boolean) => {
    const isThisPlayerWinner = isAddressEqual(winner, player.address);
    return (
      <Card>
        {gamePhase === GamePhase.GameOver && hasWinner ? (
          <Badge $winner={isThisPlayerWinner}>
            {isThisPlayerWinner ? 'Winner' : 'Loser'}
          </Badge>
        ) : (
          isAddressEqual(playerTurn[gamePhase], player.address) && (
            <Timer>time left: {formatTime(remainingTime ?? 0)}</Timer>
          )
        )}
        <PlayerInfo>
          Player {isPlayerOne ? '1' : '2'}: {getLabel(player.address, account)}
        </PlayerInfo>
        <PlayerInfo>
          Played Hand:
          {isPlayerOne
            ? shortenAddress(player.hiddenHand as Address)
            : player.hand}
        </PlayerInfo>
        {isPlayerOne ? (
          <PlayerOneMove winner={winner} setWinner={setWinner} />
        ) : (
          <PlayerTwoMove winner={winner} />
        )}
      </Card>
    );
  };
  return (
    <Container>
      <button onClick={() => navigate(-1)}>go Back</button>
      <Title>Active Game</Title>
      <div>
        <p>Stake: {formatEther(gameDetails.stake)} ETH</p>
        <p>Timeout: {Number(gameDetails.timeout) / 60} mins</p>
        <p>
          Last Action: {convertUnixToDate(gameDetails.lastAction.toString())}
        </p>
      </div>
      <CardContainer>
        {playerCard(gameDetails.player1, true)}
        {playerCard(gameDetails.player2, false)}
      </CardContainer>
    </Container>
  );
};

export default ActiveGame;
