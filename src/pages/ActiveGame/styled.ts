import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1200px;
  margin: 4rem auto;
  padding: 20px;
  text-align: center;
`;

export const Title = styled.h1`
  font-size: 36px;
  margin-bottom: 20px;
`;

export const CardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
