import React from 'react';

const TopSortBar = ({ sortBy, setSortBy }) => {
  return (
    <div className="d-flex gap-3 border-bottom pb-2 mb-3 bg-white">

      {['cheapest', 'fastest', 'best'].map(option => (
        <button
          key={option}
          className={`btn btn-sm ${sortBy === option ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setSortBy(option)}
        >
          {option.charAt(0).toUpperCase() + option.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default TopSortBar;
