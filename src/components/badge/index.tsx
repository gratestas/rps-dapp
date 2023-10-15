import styled from 'styled-components';

interface BadgeProps {
  status: 'winner' | 'tie' | 'loser';
}

const Badge: React.FC<BadgeProps> = ({ status }) => {
  return <StyledBadge $status={status}>{status}</StyledBadge>;
};

export default Badge;

const StyledBadge = styled.div<{ $status?: 'winner' | 'tie' | 'loser' }>`
  position: absolute;
  text-transform: capitalize;
  text-align: center;
  min-width: 30px;
  top: 16px;
  right: 16px;
  padding: 6px 10px;
  border: 1px solid
    ${(props) =>
      props.$status === 'winner'
        ? '#56be68'
        : props.$status === 'tie'
        ? '#ffca38'
        : '#ec5b5b'};
  border-radius: 30px;
  font-size: 14px;
  font-weight: 500;
  background: ${(props) =>
    props.$status === 'winner'
      ? '#cbf5d2be'
      : props.$status === 'tie'
      ? '#ffedbc'
      : '#f8d7d7cf'};
  color: ${(props) =>
    props.$status === 'winner'
      ? '#0d6e1d'
      : props.$status === 'tie'
      ? '#d88800'
      : '#d80d0d'};
`;
