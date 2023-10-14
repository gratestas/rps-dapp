import { useEffect, useState } from 'react';
import { Address, Hash, parseUnits } from 'viem';
import { useParams, useRevalidator } from 'react-router-dom';

import {
  Form,
  FormGroup,
  FormRow,
  Input,
  Label,
  Select,
  StyledSvg,
  ValidationError,
} from './styled';

import Button from '../../button';
import { PlayerMove } from '../../newGame/types';

import { useWeb3Connection } from '../../../context/Web3ConnectionContext';
import { GamePhase, useGameContext } from '../../../context/GameContext';

import { hasherContract, rpsContract } from '../../../data/config';
import { publicClient, walletClient } from '../../../config/provider';
import useFormValidation from '../../../hooks/useFormValidation';
import { RevealFormState } from './types';
import { validate } from './validate';

interface Props {
  hiddenHand: Hash;
  playedHand: PlayerMove;
  setPlayedHand: React.Dispatch<React.SetStateAction<PlayerMove>>;
}

const RevealCommit: React.FC<Props> = ({
  hiddenHand,
  playedHand,
  setPlayedHand,
}) => {
  const { id: gameId } = useParams();
  const { account } = useWeb3Connection();
  const { setGamePhase } = useGameContext();
  const revalidator = useRevalidator();

  const [isVerified, setIsVerified] = useState(false);
  const [txHash, setTxHash] = useState<Hash>();
  const [isLoading, setIsLoading] = useState(false);

  const { values, touched, errors, hasError, handleChange, handleBlur } =
    useFormValidation({
      initialValues: { move: PlayerMove.Null, salt: null },
      validate,
      optionalArg: isVerified,
    });

  const handleReveal = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!account || hasError) return;
    setIsLoading(true);
    try {
      const txHash_ = await (walletClient as any).writeContract({
        address: gameId as Address,
        account,
        abi: rpsContract.abi,
        functionName: 'solve',
        args: [values.move, parseUnits(values.salt!.toString(), 18)],
      });
      localStorage.setItem('playedHand', JSON.stringify(playedHand));
      setTxHash(txHash_);
    } catch (error) {
      console.error('Error: Failed to Reveal commit', error);
      setIsLoading(false);
    }
  };
  console.log({ errors });
  console.log({ touched });
  console.log({ values });
  console.log({ isVerified });

  useEffect(() => {
    setPlayedHand(values.move);
  }, [setPlayedHand, values.move]);

  useEffect(() => {
    (async () => {
      if (!txHash) return;
      try {
        await (publicClient as any).waitForTransactionReceipt({
          confirmations: 2,
          hash: txHash,
        });
        setGamePhase(GamePhase.GameOver);
        revalidator.revalidate();
      } catch (error) {
        console.error('Error: Failed to fetch Tx Receipt', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [playedHand, revalidator, setGamePhase, txHash]);

  const handleVerify = async () => {
    const hash = await (publicClient as any).readContract({
      ...hasherContract,
      functionName: 'hash',
      args: [playedHand, parseUnits(values.salt?.toString() || '', 18)],
    });
    setIsVerified(hash === hiddenHand);
  };

  return (
    <div>
      <p>Player 2 has played. Reveal your commit.</p>
      <Form onSubmit={handleReveal}>
        <FormGroup>
          <Label>Played Hand:</Label>
          <Select
            name='move'
            value={values.move}
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
          <Label>Secret code</Label>
          <FormRow>
            <Input
              type='number'
              name='salt'
              value={values.salt || ''}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Button type='button' size='small' onClick={handleVerify}>
              {isVerified ? <CheckIcon /> : 'Verify'}
            </Button>
          </FormRow>
          {errors.salt && touched.salt ? (
            <ValidationError>{errors.salt}</ValidationError>
          ) : null}
        </FormGroup>

        <Button
          type='submit'
          size='small'
          disabled={!isVerified}
          isLoading={isLoading}
        >
          Reveal
        </Button>
      </Form>
    </div>
  );
};

export default RevealCommit;

/* const ChevronDownIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    className='lucide lucide-chevron-down'
  >
    <path d='m6 9 6 6 6-6' />
  </svg>
);
 */
const CheckIcon = () => (
  <StyledSvg
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    className='lucide lucide-check'
  >
    <polyline points='20 6 9 17 4 12' />
  </StyledSvg>
);
