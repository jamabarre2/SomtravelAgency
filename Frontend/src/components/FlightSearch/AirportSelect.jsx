import React from 'react';
import Select from 'react-select';
import { Controller } from 'react-hook-form';
import { fetchAirportOptions } from './helpers';

const AirportSelect = ({ name, control, label, error }) => (
  <div className="mb-2">
    <Controller
      name={name}
      control={control}
      rules={{ required: `${label} is required` }}
      render={({ field }) => (
        <Select
          {...field}
          placeholder={label}
          loadOptions={fetchAirportOptions}
          isClearable
          defaultOptions
        />
      )}
    />
    {error && <small className="text-danger">{error.message}</small>}
  </div>
);

export default AirportSelect;