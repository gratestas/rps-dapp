import { useEffect, useState } from 'react';
import { useParams, useRevalidator } from 'react-router-dom';
import { Address, Hash } from 'viem';

import Button from '../../button';

import { useWeb3Connection } from '../../../context/Web3ConnectionContext';
import { rpsContract } from '../../../data/config';
import { publicClient, walletClient } from '../../../config/provider';

const WithdrawDeposit = () => {
  const { id: gameId } = useParams();
  const { account, checkAndSwitchNetwork } = useWeb3Connection();
  const revalidator = useRevalidator();

  const [txHash, setTxHash] = useState<Hash>();
  const [isLoading, setIsLoading] = useState(false);

  const handleWithdrawal = async () => {
    console.log('deposit withdrawn');
    if (!account) return;
    try {
      setIsLoading(true);
      await checkAndSwitchNetwork();
      const txHash_ = await (walletClient as any).writeContract({
        address: gameId as Address,
        account,
        abi: rpsContract.abi,
        functionName: 'j2Timeout',
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
        revalidator.revalidate();
      } catch (error) {
        console.error('Error: Failed to fetch Tx Receipt', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [revalidator, txHash]);

  return (
    <div>
      <p>Player 2 didn't play on time</p>
      <Button onClick={handleWithdrawal} size='small' isLoading={isLoading}>
        Withdraw deposit
      </Button>
    </div>
  );
};

export default WithdrawDeposit;
