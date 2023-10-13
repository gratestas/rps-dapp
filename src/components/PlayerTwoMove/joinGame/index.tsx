import React, { useEffect, useState } from 'react';
import { useParams, useRouteLoaderData } from 'react-router-dom';
import styled from 'styled-components';

import {
  Address,
  Hash,
  createPublicClient,
  createWalletClient,
  custom,
  http,
} from 'viem';
import { goerli } from 'viem/chains';

import {
  InjectedProvider,
  useWeb3Connection,
} from '../../../context/Web3ConnectionContext';
import { PlayerMove } from '../../newGame';
import { GameDetails } from '../../../utils/readContract';
import { rpsContract } from '../../../data/config';
import { GamePhase, useGameContext } from '../../../context/GameContext';

const ethereum = (window as any as { ethereum?: InjectedProvider }).ethereum;

const walletClient = createWalletClient({
  chain: goerli,
  transport: custom(ethereum!),
});

const publicClient = createPublicClient({
  chain: goerli,
  transport: http(),
});

const JoinGame = () => {
  const [move, setMove] = useState<PlayerMove>();
  const [txHash, setTxHash] = useState<Hash>();

  const { id: gameId } = useParams();
  const gameDetails = useRouteLoaderData('game') as GameDetails;

  const { account } = useWeb3Connection();
  const { setGamePhase } = useGameContext();

  useEffect(() => {
    (async () => {
      if (!txHash) return;
      try {
        await (publicClient as any).waitForTransactionReceipt({
          txHash,
        });
        setGamePhase(GamePhase.Reveal);
      } catch (error) {
        console.error('Error: Failed to fetch Tx Receipt', error);
      }
    })();
  }, [setGamePhase, txHash]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!move || !gameDetails.stake || !account) return;
    try {
      const txHash_ = await (walletClient as any).writeContract({
        address: gameId as Address,
        account: account,
        abi: rpsContract.abi,
        functionName: 'play',
        args: [move],
        value: gameDetails.stake,
      });
      setTxHash(txHash_);
    } catch (error) {
      console.error('Error: Failed to invoke Play() function', error);
    }
  };
  return (
    <div>
      <div>Choose your hand</div>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Move Choice:</Label>
          <Select
            value={move}
            onChange={(e) => {
              const selectedMove = parseInt(e.target.value) as PlayerMove;
              setMove(selectedMove);
            }}
          >
            {Object.keys(PlayerMove).map((key) => {
              const moveValue = PlayerMove[key as keyof typeof PlayerMove];
              if (!isNaN(Number(key))) {
                return null; // Skip numeric indices
              }
              return (
                <option key={key} value={String(moveValue)}>
                  {key}
                </option>
              );
            })}
          </Select>
        </FormGroup>

        <Button type='submit'>Play</Button>
      </Form>
    </div>
  );
};

export default JoinGame;

const Form = styled.form`
  text-align: left;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-size: 16px;
  display: block;
  margin-bottom: 5px;
`;

const Select = styled.select`
  font-size: 16px;
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
`;

const Button = styled.button`
  font-size: 14px;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  background-color: #28262b;
  color: #fff;
  cursor: pointer;
`;
