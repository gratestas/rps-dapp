import styled from 'styled-components';

import ConnectButtion from '../connectButton';
import { useWeb3Connection } from '../../context/Web3ConnectionContext';
import { shortenAddress } from '../../utils/shortenAddress';
import { useState } from 'react';
import WalletIcon from '../icons/Wallet';

const AccountPanel = () => {
  const { isConnected, account, disconnect } = useWeb3Connection();
  const [isOpen, setOpen] = useState(false);
  return (
    <>
      {isConnected ? (
        <Wrapper onClick={() => setOpen((prevState) => !prevState)}>
          <WalletIcon />
          <Text>{shortenAddress(account)}</Text>
          {/* <ArrowDown /> */}
          {isOpen && (
            <DropDownPanel onClick={() => disconnect()}>
              disconnect
            </DropDownPanel>
          )}
        </Wrapper>
      ) : (
        <ConnectButtion />
      )}
    </>
  );
};

export default AccountPanel;

const Wrapper = styled.div`
  position: relative;
  padding: 14px 18px;
  background: #212122;
  border-radius: 0.4rem;
  display: flex;
  align-items: center;
  column-gap: 4px;
  cursor: pointer;
`;

const Text = styled.div`
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  margin-left: 4px;
  padding-left: 6px;
  border-left: 1px solid #ffffff9b;
`;

const DropDownPanel = styled.div`
  position: absolute;
  bottom: -60px;
  width: min-content;
  height: 40px;
  border-radius: 2rem;
  background: #a7a6a6;
  display: flex;
  align-items: center;
  padding: 6px 20px;
`;
