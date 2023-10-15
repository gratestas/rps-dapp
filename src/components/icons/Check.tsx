import styled from 'styled-components';

const CheckIcon = () => (
  <StyledSvg
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='#1fa873'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    className='lucide lucide-check-circle-2'
  >
    <path d='M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z' />
    <path d='m9 12 2 2 4-4' />
  </StyledSvg>
);

export default CheckIcon;

export const StyledSvg = styled.svg`
  width: 18px;
  height: 18px;
  color: #5ee274;
`;
