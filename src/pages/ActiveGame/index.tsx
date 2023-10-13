import styled from 'styled-components';
import { Address, formatEther, isAddressEqual, zeroAddress } from 'viem';
import {
  LoaderFunction,
  LoaderFunctionArgs,
  useLoaderData,
  useNavigate,
} from 'react-router-dom';

import { Player, getGameDetails } from '../../utils/readContract';
import { getLabel, shortenAddress } from '../../utils/shortenAddress';
import { convertUnixToDate } from '../../utils/time';
import { LoaderData } from './types';
import { useWeb3Connection } from '../../context/Web3ConnectionContext';
import PlayerTwoMove from '../../components/PlayerTwoMove';
import PlayerOneMove from '../../components/PlayerOneMove';
import { useState } from 'react';
import { GamePhase, useGameContext } from '../../context/GameContext';

export const loader = (async ({ params }: LoaderFunctionArgs) => {
  return await getGameDetails(params.id as Address);
}) satisfies LoaderFunction;

const ActiveGame: React.FC = () => {
  const gameDetails = useLoaderData() as LoaderData<typeof loader>;
  const { account } = useWeb3Connection();
  const { gamePhase } = useGameContext();
  const navigate = useNavigate();

  const [winner, setWinner] = useState<Address>(zeroAddress);
  const hasWinner = !isAddressEqual(winner, zeroAddress);
  console.log({ winner });
  const playerCard = (player: Player, isPlayerOne: boolean) => {
    const isThisPlayerWinner = isAddressEqual(winner, player.address);
    return (
      <Card>
        {gamePhase === GamePhase.GameOver && hasWinner && (
          <Badge $winner={isThisPlayerWinner}>
            {isThisPlayerWinner ? 'Winner' : 'Loser'}
          </Badge>
        )}
        <PlayerInfo>
          Player {isPlayerOne ? '1' : '2'}: {getLabel(player.address, account)}
        </PlayerInfo>
        <PlayerInfo>
          Hand:
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
      <Header>Active Game Details</Header>
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

const Container = styled.div`
  max-width: 1200px;
  margin: auto;
  padding: 20px;
`;

const Header = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const CardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Card = styled.div`
  position: relative;
  flex: 1;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  margin: 0 10px;
  background-color: #f9f9f9;

  @media (max-width: 768px) {
    margin: 10px 0;
  }
`;

const Badge = styled.div<{ $winner?: boolean }>`
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 6px 10px;
  border: 1px solid ${(props) => (props.$winner ? '#56be68' : '#ec5b5b')};
  border-radius: 30px;
  font-size: 14px;
  font-weight: 500;
  background: ${(props) => (props.$winner ? '#cbf5d2be' : '#f8d7d7cf')};
  color: ${(props) => (props.$winner ? '#0d6e1d' : '#d80d0d')};
`;

const PlayerInfo = styled.div`
  font-size: 16px;
  margin-bottom: 10px;
`;
