import Game from 'pages/Game';
import Home from 'pages/Home';
import { GameProvider } from 'context/GameContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/session"
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
