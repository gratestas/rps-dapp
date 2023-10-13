import React, { useEffect, useState } from 'react';
import {
  Address,
  Hash,
  TransactionReceipt,
  parseEther,
  parseUnits,
} from 'viem';

import { hasherContract, rpsContract } from '../../data/config';
import { useWeb3Connection } from '../../context/Web3ConnectionContext';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { publicClient, walletClient } from '../../config/provider';

export enum PlayerMove {
  Null = 0,
  Rock = 1,
  Paper = 2,
  Scissors = 3,
  Spock = 4,
  Lizard = 5,
}
type GameFormState = {
  move: PlayerMove;
  salt: number | null;
  player2Address: Address | null;
  stake: string | null;
};

const NewGame: React.FC = () => {
  const { account } = useWeb3Connection();
  const navigate = useNavigate();

  const [txHash, setTxHash] = useState<Hash>();
  const [value, setValue] = useState<GameFormState>({
    move: PlayerMove.Null,
    salt: null,
    player2Address: null,
    stake: null,
  });

  const handleCreateGame = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (
        value.salt === null ||
        account === null ||
        !value.player2Address ||
        !value.stake
      )
        return;
      const hiddenHand = await (publicClient as any).readContract({
        ...hasherContract,
        functionName: 'hash',
        args: [value.move, parseUnits(value.salt.toString(), 18)],
      });

      const txHash_ = await (walletClient as any).deployContract({
        ...rpsContract,
        account,
        args: [hiddenHand, value.player2Address],
        value: parseEther(value.stake?.toString()),
      });
      setTxHash(txHash_);
    } catch (error) {
      console.error('Error creating game:', error);
    }
  };

  useEffect(() => {
    (async () => {
      if (!txHash) return;
      try {
        const receipt: TransactionReceipt = await (
          publicClient as any
        ).waitForTransactionReceipt({
          hash: txHash,
        });

        navigate(`game/${receipt.contractAddress}`);
      } catch (error) {
        console.error('Error: Failed to fetch Tx Receipt', error);
      } finally {
        // NOTE: Due to exersice constraints and limited options for real-time updates
        // and maintaining game state, localStorage is used to keep track of states below.
        // Reqired to clean storage before each new game.
        localStorage.removeItem('playedHand');
        localStorage.removeItem('gamePhase');
      }
    })();
  }, [txHash, navigate]);

  return (
    <Container>
      <Header>Create Game</Header>
      <SubHeader>Commit Your Move</SubHeader>
      <Form onSubmit={handleCreateGame}>
        <FormGroup>
          <Label>Move Choice</Label>
          <Select
            value={value.move}
            onChange={(e) => {
              const selectedMove = parseInt(e.target.value) as PlayerMove;
              setValue({ ...value, move: selectedMove });
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
        <FormGroup>
          <Label>Secret code</Label>
          <Input
            type='number'
            value={value.salt || ''}
            onChange={(e) =>
              setValue({ ...value, salt: Number(e.target.value) || null })
            }
          />
        </FormGroup>
        <FormGroup>
          <Label>Set your bet (ETH)</Label>
          <Input
            type='number'
            placeholder='1 ETH'
            required
            value={value.stake || ''}
            onChange={(e) => setValue({ ...value, stake: e.target.value })}
          />
        </FormGroup>
        <FormGroup>
          <Label>Enter Address of Player 2</Label>
          <Input
            type='text'
            value={value.player2Address ?? ''}
            onChange={(e) =>
              setValue({ ...value, player2Address: e.target.value as Address })
            }
          />
        </FormGroup>
        <Button type='submit'>Create</Button>
      </Form>
    </Container>
  );
};

export default NewGame;

const Container = styled.div`
  width: 500px;
  margin: auto;
  padding: 26px;
  border: 1px solid #ccc;
  border-radius: 12px;
  background-color: #f9f9f9;
  text-align: center;
`;

const Header = styled.h1`
  margin-bottom: 10px;
  color: #383838;
`;

const SubHeader = styled.h3`
  font-size: 18px;
  margin-bottom: 20px;
`;

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

const Input = styled.input`
  font-size: 16px;
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
`;

const Button = styled.button`
  font-size: 16px;
  width: 100%;
  padding: 20px 20px;
  border: none;
  border-radius: 10px;
  background-color: #28262b;
  color: #fff;
  cursor: pointer;
`;
