import React from 'react';

// Format hour to AM/PM (e.g., 09:00 AM)
const formatTime = (hour) => {
  const h = hour % 12 === 0 ? 12 : hour % 12;
  const ampm = hour < 12 ? 'AM' : 'PM';
  return `${String(h).padStart(2, '0')}:00 ${ampm}`;
};

const SidebarFilters = ({
  filters,
  setFilters,
  availableAirlines,
  availableAirports,
  carrierNames = {}
}) => {
  const update = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

  const resetFilters = () => {
    setFilters({
      stops: 'all',
      maxDurationDeparture: 24,
      maxDurationReturn: 24,
      airlines: [],
      from: '',
      to: '',
      baggageIncluded: false,
      departureTime: 0,
      arrivalTime: 0,
      departureTimeRange: [0, 23],
      arrivalTimeRange: [0, 23]
    });
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Filters</h5>
        <button className="btn btn-sm btn-outline-secondary" onClick={resetFilters}>
          Reset
        </button>
      </div>

      {/* Stops */}
      <div className="mb-3">
        <label className="form-label">Stops</label>
        {['all', 'nonstop', 'onestop', 'twoplus'].map((val) => (
          <div key={val} className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="stops"
              value={val}
              checked={filters.stops === val}
              onChange={() => update('stops', val)}
            />
            <label className="form-check-label">
              {{
                all: 'All',
                nonstop: 'Non-stop',
                onestop: '1 Stop',
                twoplus: '2+ Stops'
              }[val]}
            </label>
          </div>
        ))}
      </div>

      {/* Max Duration */}
      <div className="mb-3">
        <label className="form-label">
          Max Duration (Departure): {filters.maxDurationDeparture}h
        </label>
        <input
          type="range"
          className="form-range"
          min="1"
          max="48"
          value={filters.maxDurationDeparture}
          onChange={(e) => update('maxDurationDeparture', parseInt(e.target.value))}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">
          Max Duration (Return): {filters.maxDurationReturn}h
        </label>
        <input
          type="range"
          className="form-range"
          min="1"
          max="48"
          value={filters.maxDurationReturn}
          onChange={(e) => update('maxDurationReturn', parseInt(e.target.value))}
        />
      </div>

      {/* Airlines */}
      <div className="mb-3">
        <label className="form-label">Airlines</label>
        {availableAirlines.map((code) => (
          <div key={code} className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              value={code}
              checked={filters.airlines.includes(code)}
              onChange={(e) => {
                const updatedAirlines = e.target.checked
                  ? [...filters.airlines, code]
                  : filters.airlines.filter((c) => c !== code);
                update('airlines', updatedAirlines);
              }}
            />
            <label className="form-check-label">{carrierNames[code] || code}</label>
          </div>
        ))}
      </div>

      {/* From/To Airports */}
      <div className="mb-3">
        <label className="form-label">From</label>
        <select
          className="form-select"
          value={filters.from}
          onChange={(e) => update('from', e.target.value)}
        >
          <option value="">Any</option>
          {availableAirports.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">To</label>
        <select
          className="form-select"
          value={filters.to}
          onChange={(e) => update('to', e.target.value)}
        >
          <option value="">Any</option>
          {availableAirports.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      {/* Departure Time Range */}
      <div className="mb-3">
        <label className="form-label">
          Departure Time Range: {formatTime(filters.departureTimeRange?.[0] ?? 0)} - {formatTime(filters.departureTimeRange?.[1] ?? 23)}
        </label>
        <div className="d-flex gap-2">
          <input
            type="range"
            min="0"
            max="23"
            value={filters.departureTimeRange?.[0] ?? 0}
            onChange={(e) =>
              update('departureTimeRange', [
                parseInt(e.target.value),
                filters.departureTimeRange?.[1] ?? 23
              ])
            }
            className="form-range"
          />
          <input
            type="range"
            min="0"
            max="23"
            value={filters.departureTimeRange?.[1] ?? 23}
            onChange={(e) =>
              update('departureTimeRange', [
                filters.departureTimeRange?.[0] ?? 0,
                parseInt(e.target.value)
              ])
            }
            className="form-range"
          />
        </div>
      </div>

      {/* Arrival Time Range */}
      <div className="mb-3">
        <label className="form-label">
          Arrival Time Range: {formatTime(filters.arrivalTimeRange?.[0] ?? 0)} - {formatTime(filters.arrivalTimeRange?.[1] ?? 23)}
        </label>
        <div className="d-flex gap-2">
          <input
            type="range"
            min="0"
            max="23"
            value={filters.arrivalTimeRange?.[0] ?? 0}
            onChange={(e) =>
              update('arrivalTimeRange', [
                parseInt(e.target.value),
                filters.arrivalTimeRange?.[1] ?? 23
              ])
            }
            className="form-range"
          />
          <input
            type="range"
            min="0"
            max="23"
            value={filters.arrivalTimeRange?.[1] ?? 23}
            onChange={(e) =>
              update('arrivalTimeRange', [
                filters.arrivalTimeRange?.[0] ?? 0,
                parseInt(e.target.value)
              ])
            }
            className="form-range"
          />
        </div>
      </div>
    </div>
  );
};

export default SidebarFilters;
