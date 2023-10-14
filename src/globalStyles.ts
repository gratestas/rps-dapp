import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Clash Grotesk', sans-serif;
  }
  h1{
    font-weight: 500;
    font-size: 40px;
  }
  h3,h4{
    font-weight:500;
    margin-top:10px;
    margin-bottom:8px;
  }
  p{
    margin-top:4px;
  }
  a{
    text-decoration:none;
  }
`;

export default GlobalStyle;
