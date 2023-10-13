import { useState } from 'react';
import styled from 'styled-components';

import { Address, createWalletClient, custom, parseUnits } from 'viem';
import { goerli } from 'viem/chains';

import { PlayerMove } from '../../newGame';
import {
  InjectedProvider,
  useWeb3Connection,
} from '../../../context/Web3ConnectionContext';
import { useParams } from 'react-router-dom';
import { rpsContract } from '../../../data/config';
import { GamePhase, useGameContext } from '../../../context/GameContext';

const ethereum = (window as any as { ethereum?: InjectedProvider }).ethereum;

const walletClient = createWalletClient({
  chain: goerli,
  transport: custom(ethereum!),
});

interface Props {
  playedHand: PlayerMove;
  setPlayedHand: React.Dispatch<React.SetStateAction<PlayerMove>>;
}

const RevealCommit: React.FC<Props> = ({ playedHand, setPlayedHand }) => {
  const { id: gameId } = useParams();
  const { account } = useWeb3Connection();
  const { setGamePhase } = useGameContext();

  const [salt, setSalt] = useState<number | null>(null);

  const handleReveal = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('revealing commit');
    if (!account || playedHand === PlayerMove.Null || !salt) return;
    try {
      await (walletClient as any).writeContract({
        address: gameId as Address,
        account,
        abi: rpsContract.abi,
        functionName: 'solve',
        args: [playedHand, parseUnits(salt.toString(), 18)],
      });
      setGamePhase(GamePhase.GameOver);
      localStorage.setItem('playedHand', JSON.stringify(playedHand));
    } catch (error) {
      console.error('Error: Failed to Reveal commit', error);
    }
  };

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
