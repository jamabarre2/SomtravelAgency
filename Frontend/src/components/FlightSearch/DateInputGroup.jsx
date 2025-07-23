import React from 'react';

const DateInputGroup = ({ register, tripType, errors }) => {
  return (
    <div className="row">
      <div className="col-md-6 mb-3">
        <label className="form-label">Departure Date</label>
        <input
          type="date"
          className={`form-control ${errors.departureDate ? 'is-invalid' : ''}`}
          {...register('departureDate', {
            required: 'Departure date is required'
          })}
        />
        {errors.departureDate && (
          <div className="invalid-feedback">{errors.departureDate.message}</div>
        )}
      </div>

      {tripType === 'round-trip' && (
        <div className="col-md-6 mb-3">
          <label className="form-label">Return Date</label>
          <input
            type="date"
            className={`form-control ${errors.returnDate ? 'is-invalid' : ''}`}
            {...register('returnDate', {
              required: 'Return date is required'
            })}
          />
          {errors.returnDate && (
            <div className="invalid-feedback">{errors.returnDate.message}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default DateInputGroup;
