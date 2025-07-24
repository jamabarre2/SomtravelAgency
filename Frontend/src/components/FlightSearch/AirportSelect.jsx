import React from 'react';
import AsyncSelect from 'react-select/async';
import { Controller } from 'react-hook-form';
import { fetchAirportOptions } from './helpers'; // update path if needed

const AirportSelect = ({ name, control, label, error, rules }) => (
  <div className="mb-">
    <label className="form-label">{label}</label>
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <AsyncSelect
  classNamePrefix="react-select"
  className="react-select-container"
  styles={{
    control: (base) => ({
      ...base,
      minHeight: '30px',
      fontSize: '0.875rem',
    }),
    singleValue: (base) => ({
      ...base,
      fontSize: '0.875rem'
    })
  }}
  {...field}
  loadOptions={fetchAirportOptions}
  defaultOptions={false}
  isClearable
  placeholder={label}
/>

      )}
    />
    {error && <small className="text-danger">{error.message}</small>}
  </div>
);

export default AirportSelect;
