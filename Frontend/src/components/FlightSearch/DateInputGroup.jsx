import React from 'react';
import { Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateInputGroup = ({ control, watch, errors, tripType }) => {
  const departureDate = watch('departureDate');
  const returnDate = watch('returnDate');

  return (
    <div className="row g-2">
      {/* Departure Date */}
      <div className="col-md-6">
        <label className="form-label">Departure</label>
        <Controller
          control={control}
          name="departureDate"
          rules={{ required: 'Departure date is required' }}
          render={({ field }) => (
            <DatePicker
              {...field}
              selected={field.value ? new Date(field.value) : null}
              onChange={(date) => field.onChange(date?.toISOString().split('T')[0])}
              minDate={new Date()}
              className="form-control"
              placeholderText="Select departure"
              dateFormat="yyyy-MM-dd"
            />
          )}
        />
        {errors.departureDate && (
          <div className="text-danger small">{errors.departureDate.message}</div>
        )}
      </div>

      {/* Return Date (only for round-trip) */}
      {tripType === 'round-trip' && (
        <div className="col-md-6">
          <label className="form-label">Return</label>
          <Controller
            control={control}
            name="returnDate"
            rules={{
              required: 'Return date is required',
              validate: (value) => {
                if (!value) return 'Return date is required';
                if (departureDate && value < departureDate) {
                  return 'Return date cannot be before departure';
                }
                return true;
              }
            }}
            render={({ field }) => (
              <DatePicker
                {...field}
                selected={field.value ? new Date(field.value) : null}
                onChange={(date) => field.onChange(date?.toISOString().split('T')[0])}
                minDate={departureDate ? new Date(departureDate) : new Date()}
                className="form-control"
                placeholderText="Select return"
                dateFormat="yyyy-MM-dd"
              />
            )}
          />
          {errors.returnDate && (
            <div className="text-danger small">{errors.returnDate.message}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default DateInputGroup;
