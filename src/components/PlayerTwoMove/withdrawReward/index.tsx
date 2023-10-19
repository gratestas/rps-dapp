import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { Address } from 'viem';

import Button from '../../button';

import { useWeb3Connection } from '../../../context/Web3ConnectionContext';

import { rpsContract } from '../../../data/config';
import { walletClient } from '../../../config/provider';

const WithdrawReward = () => {
  const { id: gameId } = useParams();
  const { account, checkAndSwitchNetwork } = useWeb3Connection();
  const [isLoading, setIsLoading] = useState(false);

  const handleWithdrawal = async () => {
    if (!account) return;
    try {
      setIsLoading(true);
      await checkAndSwitchNetwork();
      await (walletClient as any).writeContract({
        address: gameId as Address,
        account,
        abi: rpsContract.abi,
        functionName: 'j1Timeout',
      });
    } catch (error) {
      console.error('Error: Failed to withdraw deposit', error);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h3>Congrads! You won 🎉</h3>
      <p>Player 1 didn't play on time</p>
      <Button
        onClick={handleWithdrawal}
        size='small'
        isLoading={isLoading}
        disabled={isLoading}
      >
        Withdraw reward
      </Button>
    </div>
  );
};

export default WithdrawReward;
