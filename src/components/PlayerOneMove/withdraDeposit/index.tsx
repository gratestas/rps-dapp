import { useParams, useRevalidator } from 'react-router-dom';
import styled from 'styled-components';
import { Address, Hash } from 'viem';
import { goerli } from 'viem/chains';

import { useWeb3Connection } from '../../../context/Web3ConnectionContext';
import { rpsContract } from '../../../data/config';
import { useEffect, useState } from 'react';
import { GamePhase, useGameContext } from '../../../context/GameContext';
import { publicClient, walletClient } from '../../../config/provider';

const WithdrawDeposit = () => {
  const { id: gameId } = useParams();
  const { account } = useWeb3Connection();
  const { setGamePhase } = useGameContext();
  const revalidator = useRevalidator();

  const [txHash, setTxHash] = useState<Hash>();

  const handleWithdrawal = async () => {
    console.log('deposit withdrawn');
    if (!account) return;
    try {
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
    }
  };

  useEffect(() => {
    (async () => {
      if (!txHash) return;
      try {
        await (publicClient as any).waitForTransactionReceipt({
          hash: txHash,
        });
        setGamePhase(GamePhase.GameOver);
        revalidator.revalidate();
      } catch (error) {
        console.error('Error: Failed to fetch Tx Receipt', error);
      }
    })();
  }, [revalidator, setGamePhase, txHash]);

  return (
    <div>
      <p>Player 2 didn't play on time</p>
      <Button onClick={handleWithdrawal}>Withdraw deposit</Button>
    </div>
  );
};

export default WithdrawDeposit;

const Button = styled.button`
  font-size: 14px;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  background-color: #28262b;
  color: #fff;
  cursor: pointer;
`;
