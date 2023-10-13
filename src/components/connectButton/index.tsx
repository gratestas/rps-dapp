import { useWeb3Connection } from '../../context/Web3ConnectionContext';
import { shortenAddress } from '../../utils/shortenAddress';

const ConnectButtion = () => {
  const { isConnected, connect, account } = useWeb3Connection();
  return (
    <div>
      <button onClick={async () => await connect()}>Connect</button>
    </div>
  );
};

export default ConnectButtion;
