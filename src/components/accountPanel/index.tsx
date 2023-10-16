import styled from 'styled-components';

import ConnectButtion from '../connectButton';
import { useWeb3Connection } from '../../context/Web3ConnectionContext';
import { shortenAddress } from '../../utils/shortenAddress';
import { useState } from 'react';
import WalletIcon from '../icons/Wallet';
import LogoutIcon from '../icons/Logout';

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
              <LogoutIcon />
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
  left: 0;
  right: 0;
  bottom: -50px;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 500;
  height: 30px;
  border-radius: 0.4rem;
  color: #2e2d2d;
  background-color: #fff;
  border: 1px solid #ccc;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  padding: 6px 20px;
`;
