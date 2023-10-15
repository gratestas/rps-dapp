import React, { useState } from 'react';
import styled, { css } from 'styled-components';

interface PopupProps {
  children: React.ReactNode;
  onClick: () => void;
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const Popup: React.FC<PopupProps> = ({
  children,
  text,
  position = 'right',
  onClick,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleClick = () => {
    setIsVisible(true);
    onClick();

    setTimeout(() => {
      setIsVisible(false);
    }, 3000);
  };

  return (
    <PopupWrapper>
      <span onClick={handleClick}>{children}</span>
      {isVisible && <PopupContent $position={position}>{text}</PopupContent>}
    </PopupWrapper>
  );
};

export default Popup;

const PopupWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const PopupContent = styled.div<{ $position: string }>`
  position: absolute;
  font-size: 12px;
  font-weight: 500;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 6px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 999;

  ${(props) => popupPositionStyles[props.$position]}
`;

const popupPositionStyles: Record<string, ReturnType<typeof css>> = {
  top: css`
    top: -100%;
    left: 0;
  `,
  bottom: css`
    top: 100%;
    left: 0;
  `,
  left: css`
    top: 0;
    left: -100%;
  `,
  right: css`
    top: 0;
    left: 140%;
  `,
};
