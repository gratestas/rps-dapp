import { Address, isAddressEqual } from 'viem';
import { Card, PlayerAddress, Info, Timer } from './styled';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import PlayerOneMove from '../PlayerOneMove';
import PlayerTwoMove from '../PlayerTwoMove';
import Badge from '../badge';

import { GameOutcome, GamePhase, Player } from '../../context/types';
import { formatTime } from '../../utils/time';
import { shortenAddress } from '../../utils/shortenAddress';
import Popup from '../popup';
import { copytoClipborad } from '../../utils/copyToClipboard';
import CopyCheckIcon from '../icons/CopyCheck';
import { PlayerMove } from '../newGame/types';

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

  const renderPlayerOneHand = () => {
    if (gamePhase === GamePhase.GameOver) {
      return getMoveKeyByValue(
        Number(JSON.parse(localStorage.getItem('playedHand')!))
      );
    } else {
      return shortenAddress(player.hiddenHand as Address);
    }
  };

  const renderPlayerTwoHand = () => {
    if (
      gamePhase === GamePhase.GameOver ||
      isAddressEqual(player.address, account)
    ) {
      return getMoveKeyByValue(player.hand!);
    } else {
      return '?';
    }
  };

  return (
    <Card>
      {gamePhase === GamePhase.GameOver && (playerOutcome !== null || isTie) ? (
        <Badge status={status} />
      ) : (
        showTimer && <Timer>time left: {formatTime(remainingTime ?? 0)}</Timer>
      )}
      <Info>
        <span>
          <Avatar seed={player.address} />
          {isAddressEqual(player.address, account)
            ? 'You'
            : `Player ${isPlayerOne ? '1' : '2'}`}
        </span>
        <PlayerAddress>
          {shortenAddress(player.address)}
          <Popup text='Copied!' onClick={() => copytoClipborad(player.address)}>
            <CopyCheckIcon />
          </Popup>
        </PlayerAddress>
      </Info>
      <Info>
        Played Hand:
        <span>
          {isPlayerOne ? renderPlayerOneHand() : renderPlayerTwoHand()}
        </span>
      </Info>
      {isPlayerOne ? <PlayerOneMove /> : <PlayerTwoMove />}
    </Card>
  );
};

export default PlayerCard;

const getMoveKeyByValue = (value: PlayerMove) =>
  Object.keys(PlayerMove).find(
    (key) => PlayerMove[key as keyof typeof PlayerMove] === value
  );

export const Avatar: React.FC<{ seed: Address }> = ({ seed }) => {
  return <Jazzicon diameter={20} seed={jsNumberForAddress(seed)} />;
};
