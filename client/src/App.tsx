import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import HomePage from './components/homepage';
import AnimeDetails from './components/AnimeDetails';
import AnimesPage from './components/AnimesPage';
import AnimeList from './components/AnimeList';

const App: React.FC = () => {
  return (
    <>
      <Router>
        <nav>
          <Link to="/">Home </Link>
          <Link to="/animes">All Animes</Link>
          <Link to="/animeList"> Favorites</Link>
        </nav>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/anime/:id" element={<AnimeDetails />} />
          <Route path="/animes" element={<AnimesPage />} />
          <Route path="/animeList" element={<AnimeList />} />
        </Routes>
      </Router>
    </>
  );
};
export default App;
