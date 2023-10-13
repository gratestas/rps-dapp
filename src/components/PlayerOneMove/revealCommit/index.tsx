import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Address, Hash, parseUnits } from 'viem';
import { useParams, useRevalidator } from 'react-router-dom';

import { PlayerMove } from '../../newGame';

import { useWeb3Connection } from '../../../context/Web3ConnectionContext';
import { GamePhase, useGameContext } from '../../../context/GameContext';

import { rpsContract } from '../../../data/config';
import { publicClient, walletClient } from '../../../config/provider';

interface Props {
  playedHand: PlayerMove;
  setPlayedHand: React.Dispatch<React.SetStateAction<PlayerMove>>;
}

const RevealCommit: React.FC<Props> = ({ playedHand, setPlayedHand }) => {
  const { id: gameId } = useParams();
  const { account } = useWeb3Connection();
  const { setGamePhase } = useGameContext();
  const revalidator = useRevalidator();

  const [salt, setSalt] = useState<number | null>(null);
  const [txHash, setTxHash] = useState<Hash>();

  const handleReveal = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('revealing commit');
    if (!account || playedHand === PlayerMove.Null || !salt) return;
    try {
      const txHash_ = await (walletClient as any).writeContract({
        address: gameId as Address,
        account,
        abi: rpsContract.abi,
        functionName: 'solve',
        args: [playedHand, parseUnits(salt.toString(), 18)],
      });
      console.log(txHash_);
      setTxHash(txHash_);
    } catch (error) {
      console.error('Error: Failed to Reveal commit', error);
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
        localStorage.setItem('playedHand', JSON.stringify(playedHand));
        revalidator.revalidate();
      } catch (error) {
        console.error('Error: Failed to fetch Tx Receipt', error);
      }
    })();
  }, [playedHand, revalidator, setGamePhase, txHash]);

  return (
    <div>
      <p>Player 2 has played. Reveal your commit.</p>
      {/* Add the code for revealing the commit here */}
      <Form onSubmit={handleReveal}>
        <FormGroup>
          <Label>Played Hand:</Label>
          <Select
            value={playedHand}
            onChange={(e) => {
              const selectedMove = parseInt(e.target.value) as PlayerMove;
              setPlayedHand(selectedMove);
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
            value={salt || ''}
            onChange={(e) => setSalt(Number(e.target.value) || null)}
          />
        </FormGroup>

        <Button type='submit'>Reveal</Button>
      </Form>
    </div>
  );
};

export default RevealCommit;

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
  font-size: 14px;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  background-color: #28262b;
  color: #fff;
  cursor: pointer;
`;
