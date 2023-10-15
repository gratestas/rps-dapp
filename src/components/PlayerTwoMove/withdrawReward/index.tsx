import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Address, Hash } from 'viem';

import Button from '../../button';

import { useWeb3Connection } from '../../../context/Web3ConnectionContext';
import { useGameContext } from '../../../context/GameContext';

import { rpsContract } from '../../../data/config';
import { publicClient, walletClient } from '../../../config/provider';

const WithdrawReward = () => {
  const { id: gameId } = useParams();
  const { account } = useWeb3Connection();
  const { updateGamePhase } = useGameContext();

  const [txHash, setTxHash] = useState<Hash>();
  const [isLoading, setIsLoading] = useState(false);

  const handleWithdrawal = async () => {
    if (!account) return;
    try {
      setIsLoading(true);
      const txHash_ = await (walletClient as any).writeContract({
        address: gameId as Address,
        account,
        abi: rpsContract.abi,
        functionName: 'j1Timeout',
      });
      setTxHash(txHash_);
    } catch (error) {
      console.error('Error: Failed to withdraw deposit', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (!txHash) return;
      try {
        await (publicClient as any).waitForTransactionReceipt({
          confirmations: 2,
          hash: txHash,
        });
        await updateGamePhase();
      } catch (error) {
        console.error('Error: Failed to fetch Tx Receipt', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [txHash, updateGamePhase]);

  return (
    <div>
      <h3>Congrads! You won 🎉</h3>
      <p>Player 1 didn't play on time</p>
      <Button onClick={handleWithdrawal} size='small' isLoading={isLoading}>
        Withdraw reward
      </Button>
    </div>
  );
};

export default WithdrawReward;
