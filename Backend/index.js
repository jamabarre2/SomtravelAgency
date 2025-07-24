import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import autocompleteRoutes from './routes/autocomplete.js';
import flightSearchRoutes from './routes/flightSearch.js';

dotenv.config();

const app = express();
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001']
  }));
app.use(express.json());

app.use('/api/autocomplete', autocompleteRoutes);
app.use('/api/flight-search', flightSearchRoutes);
app.get('/', (req, res)=>res.json({msg:'Amadeus Flight Booking APP'}));
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));