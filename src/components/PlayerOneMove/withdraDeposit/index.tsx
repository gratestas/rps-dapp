import { useState } from 'react';
import { useParams, useRevalidator } from 'react-router-dom';
import { Address } from 'viem';

import Button from '../../button';

import { useWeb3Connection } from '../../../context/Web3ConnectionContext';
import { rpsContract } from '../../../data/config';
import { walletClient } from '../../../config/provider';

const WithdrawDeposit = () => {
  const { id: gameId } = useParams();
  const { account, checkAndSwitchNetwork } = useWeb3Connection();
  const revalidator = useRevalidator();

  const [isLoading, setIsLoading] = useState(false);

  const handleWithdrawal = async () => {
    console.log('deposit withdrawn');
    if (!account) return;
    try {
      setIsLoading(true);
      await checkAndSwitchNetwork();
      await (walletClient as any).writeContract({
        address: gameId as Address,
        account,
        abi: rpsContract.abi,
        functionName: 'j2Timeout',
      });
      revalidator.revalidate();
    } catch (error) {
      console.error('Error: Failed to withdraw deposit', error);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <p>Player 2 didn't play on time</p>
      <Button
        onClick={handleWithdrawal}
        size='small'
        isLoading={isLoading}
        disabled={isLoading}
      >
        Withdraw deposit
      </Button>
    </div>
  );
};

export default WithdrawDeposit;
