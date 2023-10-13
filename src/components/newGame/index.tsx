import React, { useEffect, useState } from 'react';
import {
  Address,
  Hash,
  TransactionReceipt,
  isAddress,
  parseEther,
  parseUnits,
} from 'viem';

import { hasherContract, rpsContract } from '../../data/config';
import { useWeb3Connection } from '../../context/Web3ConnectionContext';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { publicClient, walletClient } from '../../config/provider';
import Button from '../button';

export const isValidAddress = (address: string): boolean => {
  const addressRegex = /^(0x)?[0-9a-fA-F]{40}$/;
  return addressRegex.test(address);
};

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
  player2Address: Address | string;
  stake: string;
};
type FormErrors = Partial<Record<keyof GameFormState, string>>;
type Touched = Partial<Record<keyof GameFormState, boolean>>;

const validate = (newValue: GameFormState): FormErrors => {
  const newErrors: FormErrors = {};

  if (newValue.move === PlayerMove.Null)
    newErrors.move = 'Please select your move.';
  if (newValue.salt === null) newErrors.salt = 'Please enter a secret code.';
  if (newValue.player2Address === '') {
    newErrors.player2Address = 'Please enter Player 2 address.';
  } else if (!isValidAddress(newValue.player2Address)) {
    newErrors.player2Address = 'Please enter a valid address';
  }

  if (newValue.stake === '') newErrors.stake = 'Please enter a bet amount.';
  console.log({ newErrors });
  return newErrors;
};

const NewGame: React.FC = () => {
  const { account } = useWeb3Connection();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [txHash, setTxHash] = useState<Hash>();
  const [value, setValue] = useState<GameFormState>({
    move: PlayerMove.Null,
    salt: null,
    player2Address: '',
    stake: '',
  });
  const [touched, setTouched] = useState<Touched>({});
  const [validationError, setValidationError] = useState<FormErrors>(
    validate(value)
  );

  const hasError = Object.keys(validationError).length > 0;
  console.log({ hasError });

  const handleCreateGame = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (hasError) return;
      setIsLoading(true);
      const hiddenHand = await (publicClient as any).readContract({
        ...hasherContract,
        functionName: 'hash',
        args: [value.move, parseUnits(value.salt!.toString(), 18)],
      });

      const txHash_ = await (walletClient as any).deployContract({
        ...rpsContract,
        account,
        args: [hiddenHand, value.player2Address],
        value: parseEther(value.stake.toString()),
      });
      setTxHash(txHash_);
      setValidationError({});
    } catch (error) {
      console.error('Error creating game:', error);
      setIsLoading(false);
    }
  };
  console.log({ touched });

  useEffect(() => {
    (async () => {
      if (!txHash) return;
      try {
        const receipt: TransactionReceipt = await (
          publicClient as any
        ).waitForTransactionReceipt({
          confirmations: 3,
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
        setIsLoading(false);
      }
    })();
  }, [txHash, navigate]);

  return (
    <Container>
      <Header>Create Game</Header>
      <SubHeader>Commit Your Move</SubHeader>
      <Form onSubmit={handleCreateGame} noValidate>
        <FormGroup>
          <Label>Move Choice</Label>
          <Select
            value={value.move}
            name='move'
            onBlur={() => setTouched({ ...touched, move: true })}
            onChange={(e) => {
              const selectedMove = parseInt(e.target.value) as PlayerMove;
              console.log({ selectedMove });
              setValue({ ...value, move: selectedMove });
              setValidationError(validate({ ...value, move: selectedMove }));
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
          {validationError.move && touched.move ? (
            <ValidationError>{validationError.move}</ValidationError>
          ) : null}
        </FormGroup>
        <FormGroup>
          <Label>Secret code</Label>
          <Input
            type='number'
            name='salt'
            value={value.salt || ''}
            onBlur={() => setTouched({ ...touched, salt: true })}
            onChange={(e) => {
              setValue({ ...value, salt: Number(e.target.value) || null });
              setValidationError(
                validate({ ...value, salt: Number(e.target.value) })
              );
            }}
          />
          {validationError.salt && touched.salt ? (
            <ValidationError>{validationError.salt}</ValidationError>
          ) : null}
        </FormGroup>
        <FormGroup>
          <Label>Set your bet (ETH)</Label>
          <Input
            type='number'
            name='stake'
            placeholder='1 ETH'
            value={value.stake || ''}
            onBlur={() => setTouched({ ...touched, stake: true })}
            onChange={(e) => {
              setValue({ ...value, stake: e.target.value });
              setValidationError(validate({ ...value, stake: e.target.value }));
            }}
          />
          {validationError.stake && touched.stake ? (
            <ValidationError>{validationError.stake}</ValidationError>
          ) : null}
        </FormGroup>
        <FormGroup>
          <Label>Enter Address of Player 2</Label>
          <Input
            type='text'
            name='player2Address'
            value={value.player2Address ?? ''}
            onBlur={() => setTouched({ ...touched, player2Address: true })}
            onChange={(e) => {
              setValue({
                ...value,
                player2Address: e.target.value.trim() as Address,
              });
              setValidationError(
                validate({ ...value, player2Address: e.target.value })
              );
            }}
          />
          {validationError.player2Address && touched.player2Address ? (
            <ValidationError>{validationError.player2Address}</ValidationError>
          ) : null}
        </FormGroup>
        <Button type='submit' disabled={hasError} isLoading={isLoading}>
          Create
        </Button>
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

const ValidationError = styled.p`
  font-size: 16px;
  color: red;
`;
