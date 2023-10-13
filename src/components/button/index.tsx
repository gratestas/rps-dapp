import React, { ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  size?: 'small' | 'large';
}

const Button: React.FC<ButtonProps> = ({
  children,
  isLoading = false,
  size = 'large',
  ...rest
}) => {
  return (
    <StyledButton {...rest} disabled={isLoading} size={size}>
      {isLoading ? (
        <>
          {children}
          <LoadingIndicator size={size} />
        </>
      ) : (
        children
      )}
    </StyledButton>
  );
};

export default Button;

const StyledButton = styled.button<ButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => props.size !== 'small' && '100%'};
  font-size: ${(props) => (props.size === 'small' ? '14px' : '16px')};
  padding: ${(props) => (props.size === 'small' ? '12px 20px' : '20px 20px')};
  border: none;
  border-radius: 8px;
  background-color: ${(props) => (props.isLoading ? '#38343462b' : '#28262b')};
  color: #fff;
  cursor: ${(props) => (props.isLoading ? 'not-allowed' : 'pointer')};
`;

const LoadingIndicator = styled.div<ButtonProps>`
  display: inline-block;
  border: ${(props) => (props.size === 'small' ? '3px' : '4px')} solid
    rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: ${(props) => (props.size === 'small' ? '3px' : '4px')} solid
    #d6d6d6;
  width: ${(props) => (props.size === 'small' ? '10px' : '12px')};
  height: ${(props) => (props.size === 'small' ? '10px' : '12px')};
  animation: spin 1s linear infinite;
  margin-left: 10px;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
