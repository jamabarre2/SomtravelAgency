import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import TripTypeSelector from './TripTypeSelector';
import AirportSelect from './AirportSelect';
import DateInputGroup from './DateInputGroup';
import PassengerSelector from './PassengerSelector';
import TravelClassSelector from './TravelClassSelector';

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
      returnDate: '',
      travelClass: 'ECONOMY'
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
      travelClass: data.travelClass,
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
        {/* Trip Type Selector */}
        <TripTypeSelector control={control} />

        {/* From / To Airports */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <AirportSelect
              name="from"
              control={control}
              label="From"
              error={errors.from}
              rules={{ required: 'Origin airport is required' }}
            />
          </div>
          <div className="col-md-6 mb-3">
            <AirportSelect
              name="to"
              control={control}
              label="To"
              error={errors.to}
              rules={{ required: 'Destination airport is required' }}
            />
          </div>
        </div>

        {/* Dates */}
        <DateInputGroup
          control={control}
          register={register}
          watch={watch}
          tripType={tripType}
          errors={errors}
        />

        {/* Passenger & Travel Class Selectors Aligned */}
        <div className="row mb-3">
          <div className="col-md-6 d-flex flex-column justify-content-end">
            <PassengerSelector
              passengers={passengers}
              setPassengers={setPassengers}
            />
          </div>
          <div className="col-md-6 d-flex flex-column justify-content-end">
            <TravelClassSelector control={control} />
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Search Flights
        </button>
      </form>
    </div>
  );
};

export default FlightSearchForm;
