import styled from 'styled-components';
import AccountPanel from '../accountPanel';
import { Link } from 'react-router-dom';
import EthereumIcon from '../icons/Ethereum';

const StyledHeader = styled.header`
  width: '100%';
  height: 8vh;
  border-bottom: 1px solid #e7e7e7;
  display: flex;
  padding: 0 20px;
  align-items: center;
  justify-content: space-between;
  color: white;
`;

const Logo = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 20px;
  font-weight: 600;
  line-height: 16px;
  color: black;
`;

const Header = () => {
  return (
    <StyledHeader>
      <Link to='/'>
        <Logo>
          <span>Rock.</span>
          <span>Paper.</span>
          <span>Scissors.</span>
        </Logo>
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', columnGap: '16px' }}>
        <Network />
        <AccountPanel />
      </div>
    </StyledHeader>
  );
};

export default Header;

const Network = () => {
  return (
    <StyledNetwork>
      <EthereumIcon />
      Goerli
    </StyledNetwork>
  );
};

const StyledNetwork = styled.div`
  color: #353535;
  font-weight: 500;
  font-size: 16px;
  padding-right: 10px;
  display: flex;
  align-items: center;
  column-gap: 5px;
`;
