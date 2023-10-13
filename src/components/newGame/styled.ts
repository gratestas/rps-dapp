import styled from 'styled-components';

export const Container = styled.div`
  width: 500px;
  margin: auto;
  padding: 26px;
  border: 1px solid #ccc;
  border-radius: 12px;
  background-color: #f9f9f9;
  text-align: center;
`;

export const Title = styled.h1`
  margin-bottom: 10px;
  color: #383838;
`;

export const SubTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 20px;
`;

export const Form = styled.form`
  text-align: left;
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;
`;

export const Label = styled.label`
  font-size: 16px;
  display: block;
  margin-bottom: 5px;
`;

export const Select = styled.select`
  font-size: 16px;
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
`;

export const Input = styled.input`
  font-size: 16px;
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
`;

export const ValidationError = styled.p`
  font-size: 16px;
  color: red;
`;
