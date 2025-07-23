import React from 'react';
import { Controller } from 'react-hook-form';

const TripTypeSelector = ({ control }) => (
  <Controller
    name="tripType"
    control={control}
    render={({ field }) => (
      <div className="btn-group w-100 mb-3" role="group">
        <input
          type="radio"
          className="btn-check"
          id="oneWay"
          value="one-way"
          checked={field.value === 'one-way'}
          onChange={field.onChange}
        />
        <label className="btn btn-outline-primary" htmlFor="oneWay">
          One-way
        </label>

        <input
          type="radio"
          className="btn-check"
          id="roundTrip"
          value="round-trip"
          checked={field.value === 'round-trip'}
          onChange={field.onChange}
        />
        <label className="btn btn-outline-primary" htmlFor="roundTrip">
          Round-trip
        </label>
      </div>
    )}
  />
);

export default TripTypeSelector;
