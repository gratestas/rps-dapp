import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import { Address, EIP1193Provider } from 'viem';

type Web3ConnectionContextProps = {
  account: Address | null;
  provider: InjectedProvider | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
};

const ethereum = (window as any as { ethereum?: InjectedProvider }).ethereum;

export type InjectedProvider = EIP1193Provider & {
  isMetaMask?: boolean;
  providers?: InjectedProvider[];
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

  useEffect(() => {
    (async () => {
      if (ethereum) {
        try {
          const _provider =
            ethereum.providers?.find((p) => p.isMetaMask) || ethereum;
          setProvider(_provider);
        } catch (error) {
          console.error('Error: Failed to connect to MetaMask:', error);
        }
      }
    })();
  }, []);

  const connect = useCallback(async () => {
    if (!provider) return;
    const accounts = await provider?.request({
      method: 'eth_requestAccounts',
    });
    setAccount(accounts[0]);
    setConnected(!!accounts[0]);
  }, [provider]);

  const disconnect = () => {
    setAccount(null);
    setProvider(null);
    setConnected(false);
  };

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
  }, [provider]);

  return (
    <Web3ConnectionContext.Provider
      value={{ account, provider, isConnected, connect, disconnect }}
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
