import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { Address, Hash } from 'viem';

import { useWeb3Connection } from '../../../context/Web3ConnectionContext';
import { GamePhase, useGameContext } from '../../../context/GameContext';

import { rpsContract } from '../../../data/config';
import { publicClient, walletClient } from '../../../config/provider';

const WithdrawReward = () => {
  const { id: gameId } = useParams();
  const { account } = useWeb3Connection();
  const { setGamePhase } = useGameContext();

  const [txHash, setTxHash] = useState<Hash>();

  const handleWithdrawal = async () => {
    console.log('deposit withdrawn');
    if (!account) return;
    try {
      const txHash_ = await (walletClient as any).writeContract({
        address: gameId as Address,
        account,
        abi: rpsContract.abi,
        functionName: 'j1Timeout',
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
      } catch (error) {
        console.error('Error: Failed to fetch Tx Receipt', error);
      }
    })();
  }, [setGamePhase, txHash]);

  return (
    <div>
      <h3>Congrads! You won 🎉</h3>
      <p>Player 1 didn't play on time</p>
      <Button onClick={handleWithdrawal}>Withdraw reward</Button>
    </div>
  );
};

export default WithdrawReward;

const Button = styled.button`
  font-size: 14px;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  background-color: #28262b;
  color: #fff;
  cursor: pointer;
`;
