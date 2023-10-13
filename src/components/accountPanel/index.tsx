import styled from 'styled-components';

import ConnectButtion from '../connectButton';
import { useWeb3Connection } from '../../context/Web3ConnectionContext';
import { shortenAddress } from '../../utils/shortenAddress';
import { useState } from 'react';

const AccountPanel = () => {
  const { isConnected, account, disconnect } = useWeb3Connection();
  const [isOpen, setOpen] = useState(false);
  return (
    <>
      {isConnected ? (
        <Wrapper onClick={() => setOpen((prevState) => !prevState)}>
          <Text>{shortenAddress(account)}</Text>
          <ArrowDown />
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
  padding: 6px 10px;
  background: #bdcee4;
  border-radius: 4rem;
  display: flex;
  align-items: center;
  column-gap: 4px;
  cursor: pointer;
`;

const Text = styled.div`
  color: #1d447e;
  font-weight: bold;
`;

const ArrowDown = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 100%;
  background: red;
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