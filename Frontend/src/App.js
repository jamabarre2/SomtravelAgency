import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './routes/Home';
import Results from './routes/Results';
import Navbar from './layout/Navbar';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'react-datepicker/dist/react-datepicker.css';


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </>
  );
}

export default App;