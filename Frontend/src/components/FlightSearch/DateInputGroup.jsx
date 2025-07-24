import React from 'react';
import DatePicker from 'react-datepicker';
import { Controller } from 'react-hook-form';
import 'react-datepicker/dist/react-datepicker.css';

const DateInputGroup = ({ control, watch, tripType, errors, compact = false }) => {
  const departureDate = watch('departureDate');
  const returnDate = watch('returnDate');

  const inputClass = `form-control ${compact ? 'form-control-sm' : ''}`;
  const duration =
    tripType === 'round-trip' &&
    departureDate &&
    returnDate
      ? Math.round(
          (new Date(returnDate) - new Date(departureDate)) /
            (1000 * 60 * 60 * 24)
        )
      : null;

  return (
    <div className="row gx-2 gy-2">
      <div className="col-md-6">
        <label className="form-label d-block">Departure Date</label>
        <Controller
          name="departureDate"
          control={control}
          rules={{ required: 'Departure date is required' }}
          render={({ field }) => (
            <DatePicker
              {...field}
              className={inputClass}
              selected={field.value ? new Date(field.value) : null}
              onChange={(date) =>
                field.onChange(date?.toISOString().split('T')[0])
              }
              dateFormat="dd MMM yyyy"
              minDate={new Date()}
              placeholderText="Select departure date"
              wrapperClassName="w-100"
            />
          )}
        />
        {errors.departureDate && (
          <small className="text-danger">{errors.departureDate.message}</small>
        )}
      </div>

      {tripType === 'round-trip' && (
        <div className="col-md-6">
          <label className="form-label d-block">Return Date</label>
          <Controller
            name="returnDate"
            control={control}
            rules={{
              required: 'Return date is required for round-trip',
              validate: (value) =>
                new Date(value) > new Date(departureDate) ||
                'Return must be after departure'
            }}
            render={({ field }) => (
              <DatePicker
                {...field}
                className={inputClass}
                selected={field.value ? new Date(field.value) : null}
                onChange={(date) =>
                  field.onChange(date?.toISOString().split('T')[0])
                }
                dateFormat="dd MMM yyyy"
                minDate={departureDate ? new Date(departureDate) : new Date()}
                placeholderText="Select return date"
                wrapperClassName="w-100"
              />
            )}
          />
          {errors.returnDate && (
            <small className="text-danger">{errors.returnDate.message}</small>
          )}
          {duration > 0 && (
            <small className="text-muted d-block mt-1">{duration} night{duration > 1 ? 's' : ''}</small>
          )}
        </div>
      )}
    </div>
  );
};

export default DateInputGroup;
