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
  font-size: 30px;
  font-weight: 500;
  color: black;
`;

const Header = () => {
  return (
    <StyledHeader>
      <Logo>Rock Paper Scissors</Logo>
      <AccountPanel />
    </StyledHeader>
  );
};

export default Header;
