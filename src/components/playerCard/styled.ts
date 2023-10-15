import styled from 'styled-components';

export const PlayerInfo = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 10px;
`;

export const Card = styled.div`
  position: relative;
  flex: 1;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  margin: 0 10px;
  background-color: #f9f9f9;
  text-align: left;
  @media (max-width: 768px) {
    margin: 10px 0;
  }
`;

export const Timer = styled.div`
  position: absolute;
  text-align: right;
  top: 18px;
  right: 16px;
  width: 110px;
  font-size: 14px;
  font-weight: 500;
`;
