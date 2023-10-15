import { Address, formatEther } from 'viem';
import {
  LoaderFunction,
  LoaderFunctionArgs,
  useLoaderData,
  useParams,
} from 'react-router-dom';

import { LoaderData } from './types';
import { CardContainer, Container, GameAddress, Title } from './styled';

import PlayerCard from '../../components/playerCard';

import { useGameContext } from '../../context/GameContext';
import { useWeb3Connection } from '../../context/Web3ConnectionContext';
import { GamePhase } from '../../context/types';

import useCountDown from '../../hooks/useCountDown';
import { getGameDetails } from '../../utils/readContract';
import { convertUnixToDate } from '../../utils/time';
import { shortenAddress } from '../../utils/shortenAddress';
import CopyCheckIcon from '../../components/icons/CopyCheck';
import { copytoClipborad } from '../../utils/copyToClipboard';
import Popup from '../../components/popup';

export const loader = (async ({ params }: LoaderFunctionArgs) => {
  return await getGameDetails(params.id as Address);
}) satisfies LoaderFunction;

const ActiveGame: React.FC = () => {
  const gameDetails = useLoaderData() as LoaderData<typeof loader>;
  const { id: gameId } = useParams();

  const { account } = useWeb3Connection();
  const { gamePhase, outcome } = useGameContext();

  const remainingTime = useCountDown({
    lastAction: Number(gameDetails.lastAction),
    timeout: Number(gameDetails.timeout),
  });

  const turnToPlay = {
    [gameDetails.player1.address]: gamePhase === GamePhase.Reveal,
    [gameDetails.player2.address]: gamePhase === GamePhase.PlayerTwoPlaying,
  };

  if (!account) return <div>Please connect to Metamask</div>;
  return (
    <Container>
      <Title>Active Game</Title>
      <GameAddress>
        {shortenAddress(gameId as Address)}
        <Popup text='Copied!' onClick={() => copytoClipborad(gameId!)}>
          <CopyCheckIcon />
        </Popup>
      </GameAddress>
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
