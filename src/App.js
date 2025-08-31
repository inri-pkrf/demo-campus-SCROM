import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
import './App.css';

import Home from './pages/Home';
import Quiz from './pages/Quiz';
import TextPage from './pages/TextPage';
import GamePage from './pages/GamePage';

function App() {
  // const navigate = useNavigate();

  return (
    <>
      <img
        src={`${process.env.PUBLIC_URL}/assets/logo.png`}
        alt="main-logo"
        className="main-logo"
        // onClick={() => navigate('/')}
      />

      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/text" element={<TextPage />} />
          <Route path="/game" element={<GamePage />} />
        </Routes>
      </Router>

    </>
  );
}

export default App;
