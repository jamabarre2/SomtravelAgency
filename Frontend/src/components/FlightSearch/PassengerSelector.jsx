import React, { useState } from 'react';

const PassengerSelector = ({ passengers, setPassengers }) => {
  const [show, setShow] = useState(false);
  const total = passengers.adult + passengers.child + passengers.infant;
  const valid = total <= 9 && passengers.infant <= passengers.adult;

  const update = (type, delta) => {
    setPassengers(prev => {
      const updated = { ...prev, [type]: Math.max(0, prev[type] + delta) };
      if (updated.adult < 1) updated.adult = 1;
      if (updated.adult + updated.child + updated.infant > 9) return prev;
      if (updated.infant > updated.adult) return prev;
      return updated;
    });
  };

  return (
    <div className="mb-3">
      <div className="p-3 border rounded" onClick={() => setShow(!show)}>
        <i className="bi bi-people"></i> {`${passengers.adult} Adult${passengers.adult > 1 ? 's' : ''}, ${passengers.child} Child${passengers.child !== 1 ? 'ren' : ''}, ${passengers.infant} Infant${passengers.infant !== 1 ? 's' : ''}`}
      </div>

      {show && (
        <div className="bg-light border rounded mt-1 p-3">
          {['adult', 'child', 'infant'].map(type => (
            <div key={type} className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-capitalize">{type}</span>
              <div className="d-flex align-items-center gap-2">
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => update(type, -1)} disabled={type === 'adult' && passengers.adult <= 1}>−</button>
                <span>{passengers[type]}</span>
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => update(type, 1)} disabled={total >= 9 || (type === 'infant' && passengers.infant >= passengers.adult)}>+</button>
              </div>
            </div>
          ))}
          {!valid && (
            <div className="text-danger small">
              {total > 9 && <div>Total passengers cannot exceed 9.</div>}
              {passengers.infant > passengers.adult && <div>Infants must not exceed adults.</div>}
            </div>
          )}
          <div className="text-end">
            <button className="btn btn-sm btn-primary mt-2" onClick={() => setShow(false)} disabled={!valid}>Done</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PassengerSelector;