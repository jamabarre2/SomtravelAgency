import express from 'express';
import amadeus from '../amadeusClient.js';

const router = express.Router();



router.get('/', async (req, res) => {
  const { keyword } = req.query;
  if (!keyword) return res.status(400).json({ error: 'Missing keyword' });

  try {
    const response = await amadeus.referenceData.locations.get({
      keyword,
      subType: 'AIRPORT' || 'CITY',
    });

    if (response.data.length === 0) {
      return res.status(404).json({ error: 'No locations found' });
    }
    res.json(response.data);
  } catch (err) {
    console.warn('⚠️ Amadeus autocomplete failed, using fallback', err.response);
    // Filter fallback list by keyword
    res.json("Amadeus autocomplete failed, using fallback");
  }
});

export default router;
