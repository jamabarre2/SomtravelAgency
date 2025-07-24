import React from 'react';
import { Controller } from 'react-hook-form';

const classes = [
  { value: 'ECONOMY', label: 'Economy' },
  { value: 'PREMIUM_ECONOMY', label: 'Premium Economy' },
  { value: 'BUSINESS', label: 'Business' },
  { value: 'FIRST', label: 'First' }
];

const TravelClassSelector = ({ control }) => (
  <div className="mb-3">
    <label className="form-label">Travel Class</label>
    <Controller
      name="travelClass"
      control={control}
      render={({ field }) => (
        <select className="form-select" {...field}>
          {classes.map(cls => (
            <option key={cls.value} value={cls.value}>
              {cls.label}
            </option>
          ))}
        </select>
      )}
    />
  </div>
);

export default TravelClassSelector;
