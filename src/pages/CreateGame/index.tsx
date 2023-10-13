import { useState } from 'react';
import styled from 'styled-components';

import NewGame from '../../components/newGame';
import JoinGame from '../../components/joinGame';

enum Tabs {
  NewGame = 'New Game',
  JoinGame = 'Join Game',
}

const Tab: React.FC<{ tab: Tabs; active: boolean; onClick: () => void }> = ({
  tab,
  active,
  onClick,
}) => {
  return (
    <div className={`tab ${active ? 'active' : ''}`} onClick={onClick}>
      {tab}
    </div>
  );
};

const CreateGame = () => {
  const [activeTab, setActiveTab] = useState<Tabs>(Tabs.NewGame);

  const tabComponents: Record<Tabs, React.ReactNode> = {
    [Tabs.NewGame]: <NewGame />,
    [Tabs.JoinGame]: <JoinGame />,
  };

  return (
    <Container>
      <Stack>
        <nav
          style={{
            width: '50%',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
        >
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
        </nav>
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
