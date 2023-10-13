import { Outlet } from 'react-router-dom';
import Header from './components/header';
import styled from 'styled-components';

const Layout = () => {
  return (
    <div>
      <Header />
      <MainContainer>
        <Outlet />
      </MainContainer>
    </div>
  );
};

export default Layout;

const MainContainer = styled.div`
  width: 96%;
  height: 80vh;
  margin: 0 auto;
`;
