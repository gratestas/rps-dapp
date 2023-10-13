import styled from 'styled-components';
import AccountPanel from '../accountPanel';

const StyledHeader = styled.header`
  width: '100%';
  height: 10vh;
  border-bottom: 1px solid #646464;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const Header = () => {
  return (
    <StyledHeader>
      <AccountPanel />
    </StyledHeader>
  );
};

export default Header;
