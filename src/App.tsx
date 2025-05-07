import Game from 'pages/Game';
import Home from 'pages/Home';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import Lobby from 'pages/Lobby';
import { GameProvider } from 'context/GameContext';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route
            path="/home"
            element={
              <GameProvider>
                <Home />
              </GameProvider>
            }
          />
          <Route
            path="/lobby/:lobby_code"
            element={
              <GameProvider>
                <Lobby />
              </GameProvider>
            }
          />
          <Route
            path="/session/:lobby_code"
            element={
              <GameProvider>
                <Game />
              </GameProvider>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
