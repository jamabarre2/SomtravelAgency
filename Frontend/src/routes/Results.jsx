import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FlightSearchForm from '../components/FlightSearch/FlightSearchForm';
import FlightOfferCard from '../components/FlightSearch/FlightOfferCard';
import SidebarFilters from '../components/FlightSearch/SidebarFilters';
import TopSortBar from '../components/FlightSearch/TopSortBar';
import axios from 'axios';

const Results = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const initialPayload = state?.payload;

  const [payload, setPayload] = useState(initialPayload);
  const [results, setResults] = useState([]);
  const [dictionaries, setDictionaries] = useState({ carriers: {}, locations: {} });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('cheapest');
  const [filters, setFilters] = useState({
    stops: 'all',
    maxDurationDeparture: 24,
    maxDurationReturn: 24,
    airlines: [],
    from: '',
    to: '',
    baggageIncluded: false,
    departureTimeRange: [0, 23],
    arrivalTimeRange: [0, 23]
  });

  const fetchResults = async (searchPayload) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:5001/api/flight-search', searchPayload);
      setResults(response.data?.data || []);
      setDictionaries(response.data?.dictionaries || { carriers: {}, locations: {} });
    } catch (err) {
      console.error('Error fetching flights:', err);
      setError('Failed to fetch flight offers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialPayload) {
      setTimeout(() => navigate('/'), 3000);
      return;
    }
    fetchResults(initialPayload);
  }, [initialPayload, navigate]);

  const handleSearch = (newPayload) => {
    setPayload(newPayload);
    fetchResults(newPayload);
  };

  const parseISODuration = (durationStr) => {
    const hours = parseInt(durationStr.match(/(\d+)H/)?.[1] || '0', 10);
    const minutes = parseInt(durationStr.match(/(\d+)M/)?.[1] || '0', 10);
    return hours * 60 + minutes;
  };

  const filteredResults = useMemo(() => {
    const filtered = results.filter(f => {
      const itineraryDurations = f.itineraries.map(itinerary => {
        const segments = itinerary.segments;
        const flightMinutes = segments.reduce(
          (acc, seg) => acc + parseISODuration(seg.duration),
          0
        );
        const layoverMinutes = segments.slice(1).reduce((acc, seg, idx) => {
          const prevArrival = new Date(segments[idx].arrival.at);
          const nextDeparture = new Date(seg.departure.at);
          const diff = Math.floor((nextDeparture - prevArrival) / (1000 * 60));
          return acc + (diff > 0 ? diff : 0);
        }, 0);
        return flightMinutes + layoverMinutes;
      });

      const durationOk =
        (itineraryDurations[0] <= filters.maxDurationDeparture * 60) &&
        (itineraryDurations.length < 2 || itineraryDurations[1] <= filters.maxDurationReturn * 60);

      const stopCount = Math.max(...f.itineraries.map(i => i.segments.length - 1));
      const stopsOk =
        filters.stops === 'all' ||
        (filters.stops === 'nonstop' && stopCount === 0) ||
        (filters.stops === 'onestop' && stopCount === 1) ||
        (filters.stops === 'twoplus' && stopCount >= 2);

      const airlineOk = filters.airlines.length === 0 || filters.airlines.includes(f.itineraries[0].segments[0].carrierCode);
      const fromOk = !filters.from || f.itineraries[0].segments[0].departure.iataCode === filters.from;
      const toOk = !filters.to || f.itineraries[0].segments.slice(-1)[0].arrival.iataCode === filters.to;

      const depOk = f.itineraries.every(i =>
        i.segments.every(s => {
          const h = new Date(s.departure.at).getHours();
          return h >= filters.departureTimeRange[0] && h <= filters.departureTimeRange[1];
        })
      );

      const arrOk = f.itineraries.every(i =>
        i.segments.every(s => {
          const h = new Date(s.arrival.at).getHours();
          return h >= filters.arrivalTimeRange[0] && h <= filters.arrivalTimeRange[1];
        })
      );

      return stopsOk && durationOk && airlineOk && fromOk && toOk && depOk && arrOk;
    });

    switch (sortBy) {
      case 'cheapest':
        return filtered.sort((a, b) => parseFloat(a.price.total) - parseFloat(b.price.total));
      case 'fastest':
        return filtered.sort((a, b) => {
          const durA = a.itineraries.reduce((acc, i) => acc + i.segments.reduce((sum, s) => sum + parseISODuration(s.duration), 0), 0);
          const durB = b.itineraries.reduce((acc, i) => acc + i.segments.reduce((sum, s) => sum + parseISODuration(s.duration), 0), 0);
          return durA - durB;
        });
      case 'best':
      default:
        return filtered;
    }
  }, [results, filters, sortBy]);

  const allAirlines = Array.from(new Set(results.flatMap(f => f.itineraries.flatMap(i => i.segments.map(s => s.carrierCode)))));
  const allAirports = Array.from(new Set(results.flatMap(f => f.itineraries.flatMap(i =>
    i.segments.flatMap(s => [s.departure.iataCode, s.arrival.iataCode])
  ))));

  if (!payload) return <p className="text-center mt-5">No search data found. Redirecting...</p>;

  return (
    <div className="container my-4">
      <div className="row justify-content-center mb-4">
        <div className="col-12 col-md-10 col-lg-8">
          <FlightSearchForm onSearch={handleSearch} initialData={payload} isMini={true} />
        </div>
      </div>

      <div className="row">
        <div className="col-md-3">
          <div
            className="bg-white rounded shadow-sm"
            style={{
              position: 'sticky',
              top: '80px',
              height: 'calc(100vh - 100px)',
              overflowY: 'auto',
              paddingBottom: '100px'
            }}
          >
            <SidebarFilters
              filters={filters}
              setFilters={setFilters}
              availableAirlines={allAirlines}
              availableAirports={allAirports}
              carriers={dictionaries.carriers}
              airports={dictionaries.locations}
            />
          </div>
        </div>

        <div className="col-md-9">
          <TopSortBar sortBy={sortBy} setSortBy={setSortBy} />

          <h5 className="mb-3">Flight Results</h5>

          {loading && <p>Loading flight offers...</p>}
          {error && <p className="text-danger">{error}</p>}
          {!loading && filteredResults.length === 0 && !error && (
            <p>No flight offers found for the selected criteria.</p>
          )}
          {!loading && filteredResults.length > 0 && (
            filteredResults.map((offer, index) => (
              <FlightOfferCard
                key={index}
                offer={offer}
                carriers={dictionaries.carriers}
                airports={dictionaries.locations}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;
