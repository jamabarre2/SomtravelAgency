import axios from 'axios';

export const fetchAirportOptions = async (inputValue) => {
  try {
    const response = await axios.get('/api/autocomplete', { params: { keyword: inputValue } });
    return response.data.map(airport => ({
      value: airport.iataCode,
      label: `${airport.name} (${airport.iataCode})`,
    }));
  } catch {
    return [];
  }
};