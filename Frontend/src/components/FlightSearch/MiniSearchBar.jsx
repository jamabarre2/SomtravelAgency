import React from 'react';

const MiniSearchBar = ({ payload }) => {
  if (!payload) return null;

  const {
    originLocationCode,
    destinationLocationCode,
    departureDate,
    returnDate,
    adults,
    children,
    infants
  } = payload;

  const formatDate = (d) => new Date(d).toLocaleDateString();

  return (
    <div className="border rounded p-3 mb-3 bg-white">
      <div className="fw-bold">
        {originLocationCode} → {destinationLocationCode}
      </div>
      <div className="text-muted">
        {formatDate(departureDate)}
        {returnDate ? ` – ${formatDate(returnDate)}` : ''}
      </div>
      <div className="small">
        {adults} Adult{adults > 1 ? 's' : ''}, {children} Child{children !== 1 ? 'ren' : ''}, {infants} Infant{infants > 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default MiniSearchBar;