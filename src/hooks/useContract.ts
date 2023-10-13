import { useEffect, useState } from 'react';
import {
  Address,
  PublicClient,
  WalletClient,
  createWalletClient,
  custom,
  publicActions,
} from 'viem';
import { goerli } from 'viem/chains';
import { InjectedProvider } from '../context/Web3ConnectionContext';
import { rpsAbi } from '../data/rpsABI';

export const useContract = (provider: InjectedProvider, account: Address) => {
  const [client, setClient] = useState<WalletClient>();

  useEffect(() => {
    const _client = createWalletClient({
      chain: goerli,
      transport: custom(provider),
    });
    setClient(_client);
  }, [provider]);

  /*   const deploy = async (hash: Address, player2: Address) =>
    await (client as WalletClient).deployContract({
      abi: rpsAbi,
      account: account,
      bytecode: '0xsdkfsdmkfds',
      args: [hash, player2],
      chain: goerli,
    }); */
};
