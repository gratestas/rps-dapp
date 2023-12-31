import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hash, TransactionReceipt, parseEther } from 'viem';

import { validate } from './validate';
import { GameFormState, PlayerMove } from './types';
import {
  Container,
  Form,
  Title,
  SubTitle,
  FormGroup,
  Label,
  Select,
  ValidationError,
  Input,
} from './styled';

import SaltGenerator from './saltGenerator';
import Button from '../button';

import { hasherContract, rpsContract } from '../../data/config';
import { useWeb3Connection } from '../../context/Web3ConnectionContext';
import { publicClient, walletClient } from '../../config/provider';
import useFormValidation from '../../hooks/useFormValidation';

const initialValues: GameFormState = {
  move: PlayerMove.Null,
  player2Address: '',
  stake: '',
};

const NewGame: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [generatedSalt, setGeneratedSalt] = useState<string | null>(null);
  const { account, checkAndSwitchNetwork } = useWeb3Connection();
  const { values, errors, hasError, touched, handleChange, handleBlur } =
    useFormValidation<GameFormState>({
      initialValues,
      validate,
      optionalArg: account,
      update: {
        onChange: () => setGeneratedSalt(null),
        inputName: 'move',
      },
    });

  const [txHash, setTxHash] = useState<Hash>();
  console.log({ values });

  const handleCreateGame = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!account || hasError || !generatedSalt) return;
      setIsLoading(true);
      const hiddenHand = await (publicClient as any).readContract({
        ...hasherContract,
        functionName: 'hash',
        args: [values.move, generatedSalt],
      });

      await checkAndSwitchNetwork();
      const txHash_ = await (walletClient as any).deployContract({
        ...rpsContract,
        account,
        args: [hiddenHand, values.player2Address],
        value: parseEther(values.stake.toString()),
      });
      setTxHash(txHash_);
    } catch (error) {
      console.error('Error creating game:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (!txHash) return;
      try {
        const receipt: TransactionReceipt = await fetchTransactionReceipt(
          txHash,
          {
            retryCount: 3,
          }
        );

        navigate(`game/${receipt.contractAddress}`);
      } catch (error) {
        console.error('Error: Failed to fetch Tx Receipt', error);
      } finally {
        // NOTE: Due to exersice constraints and limited options for real-time updates
        // and maintaining game state, localStorage is used to keep track of states below.
        // Reqired to clean storage before each new game.
        localStorage.removeItem('playedHand');
        setIsLoading(false);
      }
    })();
  }, [txHash, navigate]);

  console.log({ errors });
  return (
    <Container>
      <Title>Create Game</Title>
      <SubTitle>Commit Your Move</SubTitle>
      <Form onSubmit={handleCreateGame} noValidate>
        <FormGroup>
          <Label>Move Choice</Label>
          <Select
            value={values.move}
            name='move'
            onChange={handleChange}
            onBlur={handleBlur}
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
          {errors.move && touched.move ? (
            <ValidationError>{errors.move}</ValidationError>
          ) : null}
        </FormGroup>
        <FormGroup>
          <SaltGenerator
            move={values.move}
            generatedSalt={generatedSalt}
            setGeneratedSalt={setGeneratedSalt}
          />
        </FormGroup>
        <FormGroup>
          <Label>Set your bet (ETH)</Label>
          <Input
            type='number'
            name='stake'
            step='0.001'
            min={0.001}
            placeholder='1 ETH'
            value={values.stake || ''}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          {errors.stake && touched.stake ? (
            <ValidationError>{errors.stake}</ValidationError>
          ) : null}
        </FormGroup>
        <FormGroup>
          <Label>Enter Address of Player 2</Label>
          <Input
            type='text'
            name='player2Address'
            value={values.player2Address ?? ''}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          {errors.player2Address && touched.player2Address ? (
            <ValidationError>{errors.player2Address}</ValidationError>
          ) : null}
        </FormGroup>
        <Button
          type='submit'
          disabled={hasError || !generatedSalt || isLoading}
          isLoading={isLoading}
        >
          Create
        </Button>
      </Form>
    </Container>
  );
};

export default NewGame;

type FetchReceiptOptions = {
  retryCount: number;
};

//TODO: improve later
export const fetchTransactionReceipt = async (
  txHash: string,
  options: FetchReceiptOptions
): Promise<TransactionReceipt> => {
  try {
    const receipt = await (publicClient as any).waitForTransactionReceipt({
      confirmations: 2,
      hash: txHash,
    });

    if (!receipt && options.retryCount > 0) {
      console.warn(`Retrying... (${options.retryCount} retries left)`);
      return fetchTransactionReceipt(txHash, {
        retryCount: options.retryCount - 1,
      });
    }

    return receipt;
  } catch (error) {
    if (options.retryCount > 0) {
      console.warn(`Retrying... (${options.retryCount} retries left)`);
      return fetchTransactionReceipt(txHash, {
        retryCount: options.retryCount - 1,
      });
    }

    throw error;
  }
};
