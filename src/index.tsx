import ReactDOM from 'react-dom/client';
import './index.css';
import { Web3ConnectionProvider } from './context/Web3ConnectionContext';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import Layout from './layout';
import CreateGame from './pages/CreateGame';
import ActiveGame, { loader as ActiveGameLoader } from './pages/ActiveGame';
import GlobalStyle from './globalStyles';
import { GameProvider } from './context/GameContext';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <CreateGame /> },
      {
        path: 'game/:id',
        id: 'game',
        element: (
          <GameProvider>
            <ActiveGame />
          </GameProvider>
        ),
        loader: ActiveGameLoader,
      },
    ],
  },
]);

const App = () => (
  <Web3ConnectionProvider>
    <GlobalStyle />
    <RouterProvider router={router} />;
  </Web3ConnectionProvider>
);

const container = document.getElementById('root')!;
ReactDOM.createRoot(container).render(<App />);
