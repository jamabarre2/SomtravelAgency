import React from 'react';
import { useForm } from 'react-hook-form';
import AirportSelect from './AirportSelect';
import DateInputGroup from './DateInputGroup';
import PassengerSelector from './PassengerSelector';
import TravelClassSelector from './TravelClassSelector';
import TripTypeSelector from './TripTypeSelector';

const MiniSearchBar = ({ onSearch, initialData = {} }) => {
  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      tripType: initialData.returnDate ? 'round-trip' : 'one-way',
      from: initialData.from || {
        value: initialData.originLocationCode,
        label: initialData.originLocationCode
      },
      to: initialData.to || {
        value: initialData.destinationLocationCode,
        label: initialData.destinationLocationCode
      },
      departureDate: initialData.departureDate || '',
      returnDate: initialData.returnDate || '',
      travelClass: initialData.travelClass || 'ECONOMY'
    }
  });

  const [passengers, setPassengers] = React.useState({
    adult: initialData.adults || 1,
    child: initialData.children || 0,
    infant: initialData.infants || 0
  });

  const tripType = watch('tripType');
  const departureDate = watch('departureDate');

  // Auto-fill return date if not provided
  React.useEffect(() => {
    if (
      tripType === 'round-trip' &&
      departureDate &&
      !watch('returnDate')
    ) {
      const returnD = new Date(departureDate);
      returnD.setDate(returnD.getDate() + 3);
      setValue('returnDate', returnD.toISOString().split('T')[0]);
    }
  }, [departureDate, tripType, setValue, watch]);

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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-light border rounded p-3 mb-3"
      style={{ fontSize: '0.875rem' }}
    >
      <div className="row g-2 align-items-end">
        <div className="col-md-2">
          <TripTypeSelector control={control} />
        </div>
        <div className="col-md-2">
          <AirportSelect
            name="from"
            control={control}
            label="From"
            error={errors.from}
            rules={{ required: 'Origin is required' }}
          />
        </div>
        <div className="col-md-2">
          <AirportSelect
            name="to"
            control={control}
            label="To"
            error={errors.to}
            rules={{ required: 'Destination is required' }}
          />
        </div>
        <div className="col-md-3">
          <DateInputGroup
            control={control}
            register={register}
            watch={watch}
            tripType={tripType}
            errors={errors}
            compact={true}
          />
        </div>
        <div className="col-md-1">
          <PassengerSelector
            passengers={passengers}
            setPassengers={setPassengers}
            compact={true}
          />
        </div>
        <div className="col-md-1">
          <TravelClassSelector control={control} compact={true} />
        </div>
        <div className="col-md-1">
          <button className="btn btn-sm btn-primary w-100">Update</button>
        </div>
      </div>
    </form>
  );
};

export default MiniSearchBar;
