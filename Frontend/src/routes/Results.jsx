import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FlightSearchForm from '../components/FlightSearch/FlightSearchForm';
import FlightOfferCard from '../components/FlightSearch/FlightOfferCard';
import axios from 'axios';

const Results = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const initialPayload = state?.payload;

  const [payload, setPayload] = useState(initialPayload);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchResults = async (searchPayload) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:5001/api/flight-search', searchPayload);
      setResults(response.data?.data || []);
    } catch (err) {
      console.error('Error fetching flights:', err);
      setError('Failed to fetch flight offers.');
    } finally {
      setLoading(false);
    }
  };

  // Initial search on load
  useEffect(() => {
    if (!initialPayload) {
      setTimeout(() => navigate('/'), 3000);
      return;
    }
    fetchResults(initialPayload);
  }, [initialPayload, navigate]);

  // ✅ New: Handle user submitting a new search from the mini form
  const handleSearch = (newPayload) => {
    setPayload(newPayload);
    fetchResults(newPayload);
  };

  if (!payload) return <p className="text-center mt-5">No search data found. Redirecting...</p>;

  return (
    <div className="container my-4">
      {/* Mini Search Form at the Top */}
      <FlightSearchForm onSearch={handleSearch} initialData={payload} isMini={true} />

      <h5 className="mb-3">Flight Results</h5>

      {loading && <p>Loading flight offers...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && results.length === 0 && !error && (
        <p>No flight offers found for the selected criteria.</p>
      )}

      {results.map((offer, index) => (
        <FlightOfferCard key={index} offer={offer} />
      ))}
    </div>
  );
};

export default Results;
