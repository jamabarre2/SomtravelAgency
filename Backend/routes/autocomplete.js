import express from 'express';
import amadeus from '../amadeusClient.js';

const router = express.Router();



router.get('/', async (req, res) => {
  const { keyword } = req.query;
  if (!keyword) return res.status(400).json({ error: 'Missing keyword' });

  try {
    const response = await amadeus.referenceData.locations.get({
      keyword,
      subType: 'AIRPORT',
    });

   
    res.json(response.data);
  } catch (err) {
    console.warn('⚠️ Amadeus autocomplete failed, using fallback');
    // Filter fallback list by keyword
    const filtered = fallbackAirports.filter(a =>
      a.name.toLowerCase().includes(keyword.toLowerCase()) ||
      a.city.toLowerCase().includes(keyword.toLowerCase()) ||
      a.iataCode.toLowerCase().includes(keyword.toLowerCase())
    );

    res.json(filtered);
  }
});

export default router;
