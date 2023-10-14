import { useParams, useRevalidator } from 'react-router-dom';
import styled from 'styled-components';
import { Address, Hash } from 'viem';
import { goerli } from 'viem/chains';

import { useWeb3Connection } from '../../../context/Web3ConnectionContext';
import { rpsContract } from '../../../data/config';
import { useEffect, useState } from 'react';
import { GamePhase, useGameContext } from '../../../context/GameContext';
import { publicClient, walletClient } from '../../../config/provider';
import Button from '../../button';

const WithdrawDeposit = () => {
  const { id: gameId } = useParams();
  const { account } = useWeb3Connection();
  const { setGamePhase } = useGameContext();
  const revalidator = useRevalidator();

  const [txHash, setTxHash] = useState<Hash>();
  const [isLoading, setIsLoading] = useState(false);

  const handleWithdrawal = async () => {
    console.log('deposit withdrawn');
    if (!account) return;
    try {
      setIsLoading(true);
      const txHash_ = await (walletClient as any).writeContract({
        address: gameId as Address,
        account,
        chain: goerli,
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
  }, [revalidator, setGamePhase, txHash]);

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
