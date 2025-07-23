import React from 'react';
import { useLocation } from 'react-router-dom';
import MiniSearchBar from '../components/FlightSearch/MiniSearchBar';

const Results = () => {
  const { state } = useLocation();
  const payload = state?.payload;

  if (!payload) return <p className="text-center mt-5">No search data found.</p>;

  return (
    <div className="p-3">
      <MiniSearchBar payload={payload} />
      <h5>Flight Results</h5>
      <pre className="bg-light p-2 rounded">{JSON.stringify(payload, null, 2)}</pre>
    </div>
  );
};

export default Results;