import React from 'react';

const SidebarFilters = ({ filters, setFilters, availableAirlines, availableAirports, carrierNames = {} }) => {
  const update = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

  return (
    <div className="p-5">
      <h6 className="mb-3">Filters</h6>

      {/* Stops */}
      <div className="mb-3">
        <label className="form-label">Stops</label>
        {['all', 'nonstop', 'onestop', 'twoplus'].map(val => (
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
              {val === 'all' ? 'All' : val === 'nonstop' ? 'Non-stop' : val === 'onestop' ? '1 Stop' : '2+ Stops'}
            </label>
          </div>
        ))}
      </div>

     {/* Max Duration for Departure */}
<div className="mb-3">
  <label className="form-label">Max Duration (Departure): {filters.maxDurationDeparture}h</label>
  <input
    type="range"
    className="form-range"
    min="1"
    max="48"
    value={filters.maxDurationDeparture}
    onChange={(e) => update('maxDurationDeparture', parseInt(e.target.value))}
  />
</div>

{/* Max Duration for Return */}
<div className="mb-3">
  <label className="form-label">Max Duration (Return): {filters.maxDurationReturn}h</label>
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
        {availableAirlines.map(code => (
          <div key={code} className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              value={code}
              checked={filters.airlines.includes(code)}
              onChange={(e) => {
                const newArr = e.target.checked
                  ? [...filters.airlines, code]
                  : filters.airlines.filter(c => c !== code);
                update('airlines', newArr);
              }}
            />
            <label className="form-check-label">
              {carrierNames[code] || code}
            </label>
          </div>
        ))}
      </div>

      {/* Airports */}
      <div className="mb-3">
        <label className="form-label">From</label>
        <select
          className="form-select"
          value={filters.from}
          onChange={(e) => update('from', e.target.value)}
        >
          <option value="">Any</option>
          {availableAirports.map(a => (
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
          {availableAirports.map(a => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      {/* Departure Time Range */}
      <div className="mb-3">
        <label className="form-label">
          Departure Time Range: {filters.departureTimeRange[0]}:00 - {filters.departureTimeRange[1]}:00
        </label>
        <div className="d-flex gap-2">
          <input
            type="range"
            min="0"
            max="23"
            value={filters.departureTimeRange[0]}
            onChange={(e) =>
              update('departureTimeRange', [parseInt(e.target.value), filters.departureTimeRange[1]])
            }
          />
          <input
            type="range"
            min="0"
            max="23"
            value={filters.departureTimeRange[1]}
            onChange={(e) =>
              update('departureTimeRange', [filters.departureTimeRange[0], parseInt(e.target.value)])
            }
          />
        </div>
      </div>

      {/* Arrival Time Range */}
      <div className="mb-3">
        <label className="form-label">
          Arrival Time Range: {filters.arrivalTimeRange[0]}:00 - {filters.arrivalTimeRange[1]}:00
        </label>
        <div className="d-flex gap-2">
          <input
            type="range"
            min="0"
            max="23"
            value={filters.arrivalTimeRange[0]}
            onChange={(e) =>
              update('arrivalTimeRange', [parseInt(e.target.value), filters.arrivalTimeRange[1]])
            }
          />
          <input
            type="range"
            min="0"
            max="23"
            value={filters.arrivalTimeRange[1]}
            onChange={(e) =>
              update('arrivalTimeRange', [filters.arrivalTimeRange[0], parseInt(e.target.value)])
            }
          />
        </div>
      </div>
    </div>
  );
};

export default SidebarFilters;
