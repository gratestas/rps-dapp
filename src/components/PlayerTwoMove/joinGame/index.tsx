import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Address, Hash } from 'viem';
import {
  useParams,
  useRevalidator,
  useRouteLoaderData,
} from 'react-router-dom';

import { PlayerMove } from '../../newGame';

import { useWeb3Connection } from '../../../context/Web3ConnectionContext';
import { GamePhase, useGameContext } from '../../../context/GameContext';

import { GameDetails } from '../../../utils/readContract';
import { rpsContract } from '../../../data/config';
import { publicClient, walletClient } from '../../../config/provider';
import Button from '../../button';

const JoinGame = () => {
  const [move, setMove] = useState<PlayerMove>();
  const [txHash, setTxHash] = useState<Hash>();
  const [isLoading, setIsLoading] = useState(false);

  const { id: gameId } = useParams();
  const gameDetails = useRouteLoaderData('game') as GameDetails;
  const revalidator = useRevalidator();

  const { account } = useWeb3Connection();
  const { setGamePhase } = useGameContext();

  useEffect(() => {
    (async () => {
      if (!txHash) return;
      setIsLoading(true);
      try {
        await (publicClient as any).waitForTransactionReceipt({
          confirmations: 3,
          hash: txHash,
        });
        setGamePhase(GamePhase.Reveal);
        revalidator.revalidate();
      } catch (error) {
        console.error('Error: Failed to fetch Tx Receipt', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [revalidator, setGamePhase, txHash]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!move || !gameDetails.stake || !account) return;
    setIsLoading(true);
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
      setIsLoading(false);
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

        <Button type='submit' size='small' isLoading={isLoading}>
          Play
        </Button>
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
