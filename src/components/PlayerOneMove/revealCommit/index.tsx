import { useEffect, useState } from 'react';
import { Address, Hash, parseUnits } from 'viem';
import { useParams, useRevalidator } from 'react-router-dom';

import {
  ButtonRow,
  Form,
  FormGroup,
  Input,
  Label,
  Select,
  ValidationError,
  VerificationMessage,
} from './styled';

import Button from '../../button';
import { PlayerMove } from '../../newGame/types';

import { useWeb3Connection } from '../../../context/Web3ConnectionContext';
import { useGameContext } from '../../../context/GameContext';

import { hasherContract, rpsContract } from '../../../data/config';
import { publicClient, walletClient } from '../../../config/provider';
import useFormValidation from '../../../hooks/useFormValidation';
import { validate } from './validate';
import CheckIcon from '../../icons/Check';
import { fetchTransactionReceipt } from '../../newGame';

enum Action {
  verfiy = 'verify',
  reveal = 'reveal',
}

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
  const { account, checkAndSwitchNetwork } = useWeb3Connection();
  const { updateGamePhase } = useGameContext();
  const revalidator = useRevalidator();

  const [isVerified, setIsVerified] = useState(false);
  const [txHash, setTxHash] = useState<Hash>();
  const [isLoading, setIsLoading] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');
  const [showVerifiedMessage, setShowVerifiedMessage] = useState(false);
  const [action, setAction] = useState<Action>(Action.verfiy);

  const { values, touched, errors, hasError, handleChange, handleBlur } =
    useFormValidation({
      initialValues: { move: PlayerMove.Null, salt: null },
      validate,
      update: {
        onChange: () => {
          setAction(Action.verfiy);
          setVerificationMessage('');
        },
      },
    });
  console.log({ errors });
  console.log({ values });
  useEffect(() => {
    setPlayedHand(values.move);
  }, [setPlayedHand, values.move]);

  const handleVerify = async () => {
    const hash = await (publicClient as any).readContract({
      ...hasherContract,
      functionName: 'hash',
      args: [playedHand, values.salt || ''],
    });

    const isVerified_ = hash === hiddenHand;
    setIsVerified(isVerified_);

    setShowVerifiedMessage(true);
    if (isVerified_) {
      setVerificationMessage('Verified');
      setTimeout(() => {
        setShowVerifiedMessage(false);
        setAction(Action.reveal);
      }, 2000);
    } else {
      setVerificationMessage('Provided hand or salt is wrong');
    }
  };

  const handleReveal = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!account || hasError) return;
    setIsLoading(true);
    try {
      await checkAndSwitchNetwork();
      const txHash_ = await (walletClient as any).writeContract({
        address: gameId as Address,
        account,
        abi: rpsContract.abi,
        functionName: 'solve',
        args: [values.move, values.salt],
      });
      localStorage.setItem('playedHand', JSON.stringify(playedHand));
      setTxHash(txHash_);
    } catch (error) {
      console.error('Error: Failed to Reveal commit', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (!txHash) return;
      try {
        await fetchTransactionReceipt(txHash, { retryCount: 3 });
        await updateGamePhase();
        revalidator.revalidate();
      } catch (error) {
        console.error('Error: Failed to fetch Tx Receipt', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [playedHand, revalidator, txHash, updateGamePhase]);

  const buttonState = {
    [Action.reveal]: { text: 'Reveal', type: 'submit' },
    [Action.verfiy]: { text: 'Verify', type: 'button' },
  };

  return (
    <div>
      <p style={{ marginBottom: '10px', color: '#585858', fontSize: '14px' }}>
        Player 2 has played. Reveal your commit.
      </p>
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
          <Input
            type='string'
            name='salt'
            value={values.salt || ''}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.salt && touched.salt ? (
            <ValidationError>{errors.salt}</ValidationError>
          ) : null}
        </FormGroup>

        <ButtonRow>
          <Button
            type={buttonState[action].type as 'button' | 'submit' | 'reset'}
            size='small'
            disabled={hasError}
            isLoading={isLoading}
            onClick={handleVerify}
          >
            {buttonState[action].text}
          </Button>
          {showVerifiedMessage && action === Action.verfiy && (
            <VerificationMessage $isVerified={isVerified}>
              {isVerified && <CheckIcon />}
              {verificationMessage}
            </VerificationMessage>
          )}
        </ButtonRow>
      </Form>
    </div>
  );
};

export default RevealCommit;
