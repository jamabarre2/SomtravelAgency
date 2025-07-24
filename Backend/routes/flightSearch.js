import express from 'express';
import amadeus from '../amadeusClient.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const {
    originLocationCode,
    destinationLocationCode,
    departureDate,
    returnDate,
    adults,
    children,
    infants,
    travelClass,
    currencyCode
  } = req.body;

  // ✅ Validate required fields
  if (!originLocationCode || !destinationLocationCode || !departureDate || !adults) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const today = new Date().toISOString().split('T')[0];

  if (departureDate < today) {
    return res.status(400).json({ error: 'Departure date cannot be in the past' });
  }

  if (returnDate && returnDate <= departureDate) {
    return res.status(400).json({ error: 'Return date must be after departure date' });
  }

  const searchParams = {
    originLocationCode,
    destinationLocationCode,
    departureDate,
    adults,
    children: children || 0,
    infants: infants || 0,
    travelClass: travelClass || 'ECONOMY',
    currencyCode: currencyCode || 'USD',
    max: 20,
    nonStop: false,
    ...(returnDate ? { returnDate } : {}) // ✅ optional returnDate
  };

  try {
    const response = await amadeus.shopping.flightOffersSearch.get(searchParams);
    res.json(response.result); // ✅ fix: use .result
  } catch (err) {
    console.error('Amadeus API Error:', err.response?.data || err.message || err);
    res.status(500).json({
      error: err.response?.data || 'Flight search failed'
    });
  }
});

export default router;
