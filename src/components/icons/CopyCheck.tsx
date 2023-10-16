import styled from 'styled-components';

const CopyCheckIcon = () => {
  return (
    <StyledSvg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='lucide lucide-copy-check'
    >
      <path d='m12 15 2 2 4-4' />
      <rect width='14' height='14' x='8' y='8' rx='2' ry='2' />
      <path d='M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2' />
    </StyledSvg>
  );
};

export default CopyCheckIcon;

const StyledSvg = styled.svg`
  width: 16px;
  height: 16px;
  cursor: pointer;
  color: #818181;

  &:hover {
    color: #363636;
  }
`;
