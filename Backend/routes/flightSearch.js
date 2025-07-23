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

  if (!originLocationCode || !destinationLocationCode || !departureDate || !adults) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const searchParams = {
    originLocationCode,
    destinationLocationCode,
    departureDate,
    returnDate,
    adults,
    children: children || 0,
    infants: infants || 0,
    travelClass: travelClass || 'ECONOMY',
    currencyCode: currencyCode || 'USD',
    max: 20,
    nonStop: false
  };

  try {
    const response = await amadeus.shopping.flightOffersSearch.get(searchParams);
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Flight search failed' });
  }
});

export default router;