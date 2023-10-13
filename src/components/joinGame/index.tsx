import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../button';

const Container = styled.div`
  width: 500px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 12px;
  background-color: #f9f9f9;
  text-align: center;
`;

const Title = styled.h1`
  margin-bottom: 20px;
`;

const Input = styled.input`
  font-size: 16px;
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  margin-bottom: 20px;
`;

const JoinGameComponent: React.FC = () => {
  const [gameAddress, setGameAddress] = useState('');
  const navigate = useNavigate();

  const handleJoinGame = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`game/${gameAddress}`);
  };

  return (
    <Container>
      <Title>Join Existing Game</Title>
      <form onSubmit={handleJoinGame}>
        <Input
          type='text'
          placeholder='Enter Game Address'
          value={gameAddress}
          onChange={(e) => setGameAddress(e.target.value)}
        />
        <Button type='submit'>Join</Button>
      </form>
    </Container>
  );
};

export default JoinGameComponent;
