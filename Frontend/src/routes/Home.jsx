import React from 'react';
import FlightSearchForm from '../components/FlightSearch/FlightSearchForm';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleSearch = (payload) => {
    navigate('/results', { state: { payload } });
  };

  return (
    <div className="pt-3">
      <h4 className="text-center mb-3">Flight Search</h4>
      <FlightSearchForm onSearch={handleSearch} />
    </div>
  );
};

export default Home;