import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Address, createWalletClient, custom } from 'viem';
import { goerli } from 'viem/chains';

import {
  InjectedProvider,
  useWeb3Connection,
} from '../../../context/Web3ConnectionContext';
import { rpsContract } from '../../../data/config';

// TODO: encounted in many components throuhout the app. Refactor
const ethereum = (window as any as { ethereum?: InjectedProvider }).ethereum;
const walletClient = createWalletClient({
  chain: goerli,
  transport: custom(ethereum!),
});

const WithdrawDeposit = () => {
  const { id: gameId } = useParams();
  const { account } = useWeb3Connection();

  const handleWithdrawal = async () => {
    console.log('deposit withdrawn');
    if (!account) return;
    try {
      await (walletClient as any).writeContract({
        address: gameId as Address,
        account,
        chain: goerli,
        abi: rpsContract.abi,
        functionName: 'j2Timeout',
      });
    } catch (error) {
      console.error('Error: Failed to withdraw deposit', error);
    }
  };

  return (
    <div>
      <p>Player 2 didn't play on time</p>
      <Button onClick={handleWithdrawal}>Withdraw deposit</Button>
    </div>
  );
};

export default WithdrawDeposit;

const Button = styled.button`
  font-size: 14px;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  background-color: #28262b;
  color: #fff;
  cursor: pointer;
`;
