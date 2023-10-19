import React, { useState } from 'react';
import { Address } from 'viem';
import {
  useParams,
  useRevalidator,
  useRouteLoaderData,
} from 'react-router-dom';

import { validate } from './validate';
import { FormState } from './types';
import { Form, FormGroup, Label, Select, ValidationError } from './styled';

import Button from '../../button';
import { PlayerMove } from '../../newGame/types';

import { useWeb3Connection } from '../../../context/Web3ConnectionContext';

import { rpsContract } from '../../../data/config';
import { walletClient } from '../../../config/provider';
import useFormValidation from '../../../hooks/useFormValidation';
import { GameDetails } from '../../../context/types';

const JoinGame = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { id: gameId } = useParams();
  const gameDetails = useRouteLoaderData('game') as GameDetails;
  const revalidator = useRevalidator();

  const { account, checkAndSwitchNetwork } = useWeb3Connection();
  const { values, errors, hasError, touched, handleChange, handleBlur } =
    useFormValidation<FormState>({
      initialValues: { move: PlayerMove.Null },
      validate: validate,
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account || hasError) return;
    setIsLoading(true);
    try {
      await checkAndSwitchNetwork();
      await (walletClient as any).writeContract({
        address: gameId as Address,
        account: account,
        abi: rpsContract.abi,
        functionName: 'play',
        args: [values.move],
        value: gameDetails.stake,
      });
      revalidator.revalidate();
    } catch (error) {
      console.error('Error: Failed to invoke Play() function', error);
      setIsLoading(false);
    }
  };
  return (
    <div>
      <div style={{ marginBottom: '10px', color: '#585858', fontSize: '14px' }}>
        Choose your hand
      </div>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Move Choice:</Label>
          <Select
            name='move'
            value={values.move}
            onBlur={handleBlur}
            onChange={handleChange}
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

        <Button
          type='submit'
          size='small'
          disabled={hasError || isLoading}
          isLoading={isLoading}
        >
          Play
        </Button>
      </Form>
    </div>
  );
};

export default JoinGame;
