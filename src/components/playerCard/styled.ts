import styled from 'styled-components';

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 10px;
  color: #818181;

  span {
    display: flex;
    align-items: center;
    column-gap: 10px;
    font-size: 18px;
    color: #212122;
  }
`;

export const PlayerAddress = styled.div`
  display: flex;
  align-items: center;
  column-gap: 8px;
  margin-bottom: 1rem;
  margin-top: 6px;
  color: #818181;
  font-weight: 500;
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
