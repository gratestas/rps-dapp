import styled from 'styled-components';

export const Form = styled.form`
  text-align: left;
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;
`;

export const FormRow = styled.div`
  display: flex;
  column-gap: 0.4rem;
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

export const ButtonRow = styled.div`
  display: flex;
  column-gap: 10px;
  align-items: center;
`;

export const VerificationMessage = styled.span<{ $isVerified: boolean }>`
  display: flex;
  align-items: center;
  column-gap: 2px;
  font-size: 14px;
  font-weight: 500;
  margin: 6px 0;
  color: ${(props) => (props.$isVerified ? '#48af62' : '#d13f3f')};
`;
