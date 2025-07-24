import axios from 'axios';

export const fetchAirportOptions = async (inputValue) => {
  if (!inputValue || inputValue.length < 3) {
    return [];
  }

  try {
    const response = await axios.get('http://localhost:5001/api/autocomplete', {
      params: { keyword: inputValue }
    });

    return (response.data || []).map((airport) => ({
      value: airport.iataCode,
      label: `${airport.name} (${airport.iataCode}) - ${airport.address?.cityName || ''}`
    }));
  } catch (error) {
    console.error('Airport fetch error:', error);
    return [];
  }
};
