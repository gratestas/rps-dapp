import { Address, formatEther } from 'viem';
import {
  LoaderFunction,
  LoaderFunctionArgs,
  useLoaderData,
  useNavigate,
} from 'react-router-dom';

import { LoaderData } from './types';
import { CardContainer, Container, Title } from './styled';

import PlayerCard from '../../components/playerCard';

import { useGameContext } from '../../context/GameContext';
import { useWeb3Connection } from '../../context/Web3ConnectionContext';
import { GamePhase } from '../../context/types';

import useCountDown from '../../hooks/useCountDown';
import { getGameDetails } from '../../utils/readContract';
import { convertUnixToDate } from '../../utils/time';

export const loader = (async ({ params }: LoaderFunctionArgs) => {
  return await getGameDetails(params.id as Address);
}) satisfies LoaderFunction;

const ActiveGame: React.FC = () => {
  const gameDetails = useLoaderData() as LoaderData<typeof loader>;
  const navigate = useNavigate();

  const { account } = useWeb3Connection();
  const { gamePhase, outcome } = useGameContext();

  const remainingTime = useCountDown({
    lastAction: Number(gameDetails.lastAction),
    timeout: Number(gameDetails.timeout),
  });

  // console.log({ remainingTime });

  const turnToPlay = {
    [gameDetails.player1.address]: gamePhase === GamePhase.Reveal,
    [gameDetails.player2.address]: gamePhase === GamePhase.PlayerTwoPlaying,
  };

  if (!account) return <div>Please connect to Metamask</div>;
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
        <PlayerCard
          player={gameDetails.player1}
          gamePhase={gamePhase}
          account={account}
          outcome={outcome}
          remainingTime={remainingTime}
          isPlayerTurn={turnToPlay[gameDetails.player1.address]}
          isPlayerOne
        />
        <PlayerCard
          player={gameDetails.player2}
          gamePhase={gamePhase}
          account={account}
          outcome={outcome}
          isPlayerTurn={turnToPlay[gameDetails.player2.address]}
          remainingTime={remainingTime}
        />
      </CardContainer>
    </Container>
  );
};

export default ActiveGame;
