import { Address } from 'viem';
import { rpsContract } from '../data/config';
import { publicClient } from '../config/provider';
import { PlayerMove } from '../components/newGame/types';
import { GameDetails } from '../context/GameContext';

export const getGameDetails = async (
  rpsAddress: Address
): Promise<GameDetails> => {
  const [j1, j2, stake, lastAction, timeout, c1Hash, c2] = await Promise.all([
    (publicClient as any).readContract({
      address: rpsAddress,
      abi: rpsContract.abi,
      functionName: 'j1',
    }),
    (publicClient as any).readContract({
      address: rpsAddress,
      abi: rpsContract.abi,
      functionName: 'j2',
    }),
    (publicClient as any).readContract({
      address: rpsAddress,
      abi: rpsContract.abi,
      functionName: 'stake',
    }),
    (publicClient as any).readContract({
      address: rpsAddress,
      abi: rpsContract.abi,
      functionName: 'lastAction',
    }),
    (publicClient as any).readContract({
      address: rpsAddress,
      abi: rpsContract.abi,
      functionName: 'TIMEOUT',
    }),
    (publicClient as any).readContract({
      address: rpsAddress,
      abi: rpsContract.abi,
      functionName: 'c1Hash',
    }),
    (publicClient as any).readContract({
      address: rpsAddress,
      abi: rpsContract.abi,
      functionName: 'c2',
    }),
  ]);
  return {
    player1: {
      address: j1,
      hiddenHand: c1Hash,
    },
    player2: {
      address: j2,
      hand: c2,
    },
    stake,
    lastAction,
    timeout,
  };
};

export const checkIfPlayerWinner = async (
  player1: PlayerMove,
  player2: PlayerMove,
  contractAddress: Address
): Promise<boolean> => {
  return await (publicClient as any).readContract({
    address: contractAddress,
    abi: rpsContract.abi,
    functionName: 'win',
    args: [player1, player2],
  });
};
