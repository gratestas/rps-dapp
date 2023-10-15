import { Address } from 'viem';

import { Card, PlayerInfo, Timer } from './styled';

import PlayerOneMove from '../PlayerOneMove';
import PlayerTwoMove from '../PlayerTwoMove';
import Badge from '../badge';

import { GameOutcome, GamePhase, Player } from '../../context/GameContext';
import { formatTime } from '../../utils/time';
import { getLabel, shortenAddress } from '../../utils/shortenAddress';

interface PlayerCardProps {
  player: Player;
  gamePhase: GamePhase;
  account: Address;
  outcome: GameOutcome;
  remainingTime: number | null;
  isPlayerTurn: boolean;
  isPlayerOne?: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  gamePhase,
  account,
  outcome,
  remainingTime,
  isPlayerTurn,
  isPlayerOne = false,
}) => {
  const playerOutcome = isPlayerOne
    ? outcome.isPlayer1Winner
    : outcome.isPlayer2Winner;

  const isTie = outcome.isTie && playerOutcome === false;
  const status = isTie ? 'tie' : playerOutcome ? 'winner' : 'loser';
  const showTimer = gamePhase !== GamePhase.GameOver && isPlayerTurn;
  return (
    <Card>
      {gamePhase === GamePhase.GameOver && (playerOutcome !== null || isTie) ? (
        <Badge status={status} />
      ) : (
        showTimer && <Timer>time left: {formatTime(remainingTime ?? 0)}</Timer>
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
      {isPlayerOne ? <PlayerOneMove /> : <PlayerTwoMove />}
    </Card>
  );
};

export default PlayerCard;
