import styled from 'styled-components';
import AccountPanel from '../accountPanel';

const StyledHeader = styled.header`
  width: '100%';
  height: 8vh;
  border-bottom: 1px solid #c5c5c5;
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
      <Logo>
        <span>Rock.</span>
        <span>Paper.</span>
        <span>Scissors.</span>
      </Logo>
      <AccountPanel />
    </StyledHeader>
  );
};

export default Header;
