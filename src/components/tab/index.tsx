import styled from 'styled-components';

export enum Tabs {
  NewGame = 'New Game',
  JoinGame = 'Join Game',
}

const Tab: React.FC<{ tab: Tabs; active: boolean; onClick: () => void }> = ({
  tab,
  active,
  onClick,
}) => {
  return (
    <StyledTab className={`tab ${active ? 'active' : ''}`} onClick={onClick}>
      {tab}
    </StyledTab>
  );
};
export default Tab;

const StyledTab = styled.div`
  cursor: pointer;
  padding: 8px 16px;
  margin-right: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-weight: 500;
  display: inline-block;
  color: #7a7a7a;
  border-radius: 10rem;

  &.active {
    color: #252525;
    border-color: #6d6d6d;
  }
`;
