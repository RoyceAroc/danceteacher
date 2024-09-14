import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import Navbar from './components/Navbar';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Investors from './pages/Investors';
import PageNotFound from './pages/PageNotFound';
import Learn from './pages/game/Learn/Learn';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="dance-teacher" element={
          <>
            <Navbar />
            <Home />
          </>
        } />
        <Route path="dance-teacher/investors" element={<Investors />} />
        <Route path="dance-teacher/learn" element={<Learn />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

reportWebVitals();
