import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import TripTypeSelector from './TripTypeSelector';
import AirportSelect from './AirportSelect';
import DateInputGroup from './DateInputGroup';
import PassengerSelector from './PassengerSelector';
import TravelClassSelector from './TravelClassSelector';
import './FlightSearchForm.css';

const FlightSearchForm = ({ onSearch, initialData = {}, isMini = false }) => {
  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      tripType: initialData.tripType || 'round-trip',
      from: initialData.from || null,
      to: initialData.to || null,
      departureDate: initialData.departureDate || '',
      returnDate: initialData.returnDate || '',
      travelClass: initialData.travelClass || 'ECONOMY',
      flexibleDates: initialData.flexibleDates || false
    }
  });

  const [passengers, setPassengers] = useState({
    adult: initialData.adults || 1,
    child: initialData.children || 0,
    infant: initialData.infants || 0
  });

  const tripType = watch('tripType');
  const from = watch('from');
  const to = watch('to');

  useEffect(() => {
    if (tripType === 'one-way') {
      setValue('returnDate', '');
    }
  }, [tripType, setValue]);

  useEffect(() => {
    if (from?.value && to?.value && from.value === to.value) {
      setValue('to', null);
    }
  }, [from, to, setValue]);

  const onSubmit = (data) => {
    if (passengers.adult < 1) {
      alert('At least one adult passenger is required.');
      return;
    }

    const payload = {
      originLocationCode: data.from?.value,
      destinationLocationCode: data.to?.value,
      departureDate: data.departureDate,
      returnDate: tripType === 'round-trip' ? data.returnDate : undefined,
      adults: passengers.adult,
      children: passengers.child,
      infants: passengers.infant,
      travelClass: data.travelClass,
      currencyCode: 'EUR',
      tripType,
      searchDateWindow: data.flexibleDates ? 'PLUS_MINUS_3DAYS' : undefined,
      flexibleDates: data.flexibleDates,

      // ✅ Include full objects so form stays populated later
      from: data.from,
      to: data.to,
      adults: passengers.adult,
      children: passengers.child,
      infants: passengers.infant
    };

    onSearch?.(payload);
  };

  return (
    <div className={`container ${isMini ? 'mb-3' : 'my-4'}`}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`flight-search-form border rounded shadow-sm bg-white ${isMini ? 'p-3' : 'p-4 mx-auto'}`}
        style={isMini ? { maxWidth: '650px' } : { maxWidth: '800px' }}
      >
        <div className="row g-2 mb-2">
          <div className="col-12">
            <TripTypeSelector control={control} isMini={isMini} />
          </div>
        </div>

        <div className="row g-2 align-items-end">
          <div className="col-md-6">
            <AirportSelect
              name="from"
              control={control}
              error={errors.from}
              rules={{ required: 'Origin airport is required' }}
              isMini={isMini}
            />
          </div>
          <div className="col-md-6">
            <AirportSelect
              name="to"
              control={control}
              error={errors.to}
              rules={{ required: 'Destination airport is required' }}
              isMini={isMini}
            />
          </div>
        </div>

        <div className="row g-2 mt-2 align-items-end">
          <DateInputGroup control={control} watch={watch} errors={errors} tripType={tripType} isMini={isMini} />
        </div>

        <div className="row g-2 mt-2 align-items-end">
          <div className="col-md-6">
            <PassengerSelector passengers={passengers} setPassengers={setPassengers} isMini={isMini} />
          </div>
          <div className="col-md-6">
            <TravelClassSelector control={control} isMini={isMini} />
          </div>
        </div>

        <div className="row mt-3">
          <div className="col">
            <button type="submit" className="btn btn-primary w-100">Search Flights</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FlightSearchForm;
