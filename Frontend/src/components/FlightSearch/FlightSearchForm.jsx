import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import TripTypeSelector from './TripTypeSelector';
import AirportSelect from './AirportSelect';
import DateInputGroup from './DateInputGroup';
import PassengerSelector from './PassengerSelector';

const FlightSearchForm = ({ onSearch }) => {
  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      tripType: 'round-trip',
      from: null,
      to: null,
      departureDate: '',
      returnDate: ''
    }
  });

  const [passengers, setPassengers] = useState({ adult: 1, child: 0, infant: 0 });
  const tripType = watch('tripType');

  useEffect(() => {
    if (tripType === 'one-way') {
      setValue('returnDate', '');
    }
  }, [tripType, setValue]);

  const onSubmit = (data) => {
    const payload = {
      originLocationCode: data.from?.value,
      destinationLocationCode: data.to?.value,
      departureDate: data.departureDate,
      returnDate: tripType === 'round-trip' ? data.returnDate : undefined,
      adults: passengers.adult,
      children: passengers.child,
      infants: passengers.infant,
      travelClass: 'ECONOMY',
      currencyCode: 'EUR'
    };

    onSearch?.(payload);
  };

  return (
    <div className="container my-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border rounded shadow-sm p-4 bg-white"
        style={{ maxWidth: '800px', margin: 'auto' }}
      >
        <TripTypeSelector control={control} />

        <div className="row">
          <div className="col-md-6 mb-3">
            <AirportSelect name="from" control={control} label="From" error={errors.from} />
          </div>
          <div className="col-md-6 mb-3">
            <AirportSelect name="to" control={control} label="To" error={errors.to} />
          </div>
        </div>

        <DateInputGroup
          control={control}
          register={register}
          watch={watch}
          tripType={tripType}
          errors={errors}
        />

        <div className="mb-3">
          <PassengerSelector passengers={passengers} setPassengers={setPassengers} />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Search Flights
        </button>
      </form>
    </div>
  );
};

export default FlightSearchForm;
