import {
  createPublicClient,
  createWalletClient,
  custom,
  fallback,
  http,
} from 'viem';
import { defaultChain, infuraAPI } from '../const';
import { InjectedProvider } from '../context/Web3ConnectionContext';

const infura = http(infuraAPI);
const ethereum = (window as any as { ethereum?: InjectedProvider }).ethereum;

export const publicClient = createPublicClient({
  chain: defaultChain,
  batch: {
    multicall: true,
  },
  transport: fallback([http(), infura]),
});

export const walletClient = createWalletClient({
  chain: defaultChain,
  transport: custom(ethereum!),
});
