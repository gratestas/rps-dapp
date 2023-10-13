import { useState } from 'react';
import styled from 'styled-components';

import NewGame from '../../components/newGame';
import JoinGame from '../../components/joinGame';
import Tab, { Tabs } from '../../components/tab';

const CreateGame = () => {
  const [activeTab, setActiveTab] = useState<Tabs>(Tabs.NewGame);

  const tabComponents: Record<Tabs, React.ReactNode> = {
    [Tabs.NewGame]: <NewGame />,
    [Tabs.JoinGame]: <JoinGame />,
  };

  return (
    <Container>
      <Stack>
        <Nav>
          <Tab
            tab={Tabs.NewGame}
            active={activeTab === Tabs.NewGame}
            onClick={() => setActiveTab(Tabs.NewGame)}
          />
          <Tab
            tab={Tabs.JoinGame}
            active={activeTab === Tabs.JoinGame}
            onClick={() => setActiveTab(Tabs.JoinGame)}
          />
        </Nav>
        {tabComponents[activeTab]}
      </Stack>
    </Container>
  );
};

export default CreateGame;

const Container = styled.div`
  height: 50vh;
  width: 98%;
  margin-top: 1rem;
  display: flex;
  justify-content: center;
`;

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Nav = styled.nav`
  width: 50%;
  margin: 0 auto;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
`;
