import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import { Address, EIP1193Provider } from 'viem';
import { defaultChain } from '../const';

type Web3ConnectionContextProps = {
  account: Address | null;
  provider: InjectedProvider | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  checkAndSwitchNetwork: () => Promise<void>;
  watchBlockNumber: (callback: (blockNumber: string) => void) => void;
};

const ethereum = (window as any as { ethereum?: InjectedProvider }).ethereum;

export type InjectedProvider = EIP1193Provider & {
  isMetaMask?: boolean;
  providers?: InjectedProvider[];
};

type Message = {
  type: string; // apply stronger type
  data: {
    subscription: string;
    result: {
      number: string;
    };
  };
};

const Web3ConnectionContext = createContext<
  Web3ConnectionContextProps | undefined
>(undefined);

export const Web3ConnectionProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [account, setAccount] = useState<Address | null>(null);

  const [provider, setProvider] = useState<InjectedProvider | null>(null);
  const [isConnected, setConnected] = useState(false);

  const autoConnectPreference = localStorage.getItem('autoConnect');
  const shouldAutoConnect = autoConnectPreference === 'true';

  const connect = useCallback(async () => {
    if (!ethereum) return;

    try {
      const _provider =
        ethereum.providers?.find((p) => p.isMetaMask) || ethereum;
      setProvider(_provider);

      const chainId = await _provider.request({ method: 'eth_chainId' });
      if (`0x${defaultChain.id}` !== chainId) {
        await _provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${defaultChain.id}` }],
        });
      }
      const accounts = await _provider.request({
        method: 'eth_requestAccounts',
      });

      setAccount(accounts[0]);
      setConnected(!!accounts[0]);

      localStorage.setItem('autoConnect', 'true');
    } catch (error) {
      console.error('Error: Failed to connect to MetaMask:', error);
    }
  }, []);

  const disconnect = () => {
    setAccount(null);
    setProvider(null);
    setConnected(false);
    localStorage.removeItem('autoConnect');
  };

  const checkAndSwitchNetwork = async () => {
    if (!provider) return;
    const chainId = await provider.request({ method: 'eth_chainId' });
    if (`0x${defaultChain.id}` !== chainId) {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${defaultChain.id}` }],
      });
    }
  };

  const watchBlockNumber = useCallback(
    async (callback: (blockNumber: string) => void) => {
      const subscriptionId = await (provider as any).request({
        method: 'eth_subscribe',
        params: ['newHeads'],
      });

      const listener = (message: Message) => {
        if (message.type === 'eth_subscription') {
          const lastBlockNumber = message.data.result.number;
          if (message.data.subscription === subscriptionId && lastBlockNumber) {
            callback(lastBlockNumber);
            console.debug({ lastBlockNumber });
          }
        }
      };

      provider?.on('message', listener);

      return async () =>
        await (provider as any).request({
          method: 'eth_unsubscribe',
          params: [subscriptionId],
        });
    },
    [provider]
  );

  useEffect(() => {
    (async () => {
      if (shouldAutoConnect && ethereum) {
        await connect();
      }
    })();
  }, [connect, shouldAutoConnect]);

  useEffect(() => {
    (async () => {
      if (!provider) return;
      const accounts = await provider.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        await connect();
      }
    })();
  }, [connect, provider]);

  useEffect(() => {
    if (!provider) return;
    provider.on('accountsChanged', (accounts) => {
      accounts.length > 0 ? setAccount(accounts[0]) : disconnect();
    });

    return () => {
      provider.removeListener('accountsChanged', (accounts) => {
        setAccount(accounts[0]);
      });
    };
  }, [provider, watchBlockNumber]);

  return (
    <Web3ConnectionContext.Provider
      value={{
        account,
        provider,
        isConnected,
        connect,
        disconnect,
        checkAndSwitchNetwork,
        watchBlockNumber,
      }}
    >
      {children}
    </Web3ConnectionContext.Provider>
  );
};

export const useWeb3Connection = () => {
  const context = useContext(Web3ConnectionContext);
  if (context === undefined) {
    throw new Error(
      'useWeb3Connection must be used within a Web3ConnectionProvider'
    );
  }
  return context;
};
