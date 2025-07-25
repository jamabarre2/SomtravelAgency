import express from 'express';
import amadeus from '../amadeusClient.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const flightOffer = req.body;

  if (!flightOffer || !flightOffer.type || !flightOffer.itineraries) {
    return res.status(400).json({ error: 'Invalid or missing flight offer data' });
  }

  try {
    const response = await amadeus.shopping.flightOffers.pricing.post(
      JSON.stringify({
        data: {
          type: 'flight-offers-pricing',
          flightOffers: [flightOffer]
        }
      }),
      {
        params: { include: 'FARE_RULES' }
      }
    );

    res.json(response.result);
  } catch (err) {
    console.error('Amadeus Fare Rules API Error:', err.response?.data || err.message || err);
    console.error('Amadeus Fare Rules API Error:', err.response?.data || err.message);
    res.status(500).json({
      error: err.response?.data || 'Failed to fetch fare rules from Amadeus'
    });
  }
});

export default router;
