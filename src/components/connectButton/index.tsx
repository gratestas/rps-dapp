import { useWeb3Connection } from '../../context/Web3ConnectionContext';
import Button from '../button';

const ConnectButtion = () => {
  const { connect } = useWeb3Connection();
  return (
    <div>
      <Button size='small' onClick={async () => await connect()}>
        Connect
      </Button>
    </div>
  );
};

export default ConnectButtion;
