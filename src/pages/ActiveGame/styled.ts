import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1200px;
  margin: 4rem auto;
  padding: 20px;
  text-align: center;
`;

export const Title = styled.h1`
  font-size: 36px;
  margin-bottom: 4px;
`;

export const GameAddress = styled.span`
  display: inline-flex;
  align-items: center;
  column-gap: 8px;
  margin-bottom: 1rem;
  color: #818181;
  font-weight: 500;
`;

export const CardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
