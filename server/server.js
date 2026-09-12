import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import analyticsRoutes from './routes/analyticsRoutes.js';
import listingsRoutes from './routes/listingsRoutes.js';
import savedRoutes from './routes/savedRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/analytics', analyticsRoutes);
app.use('/api/listings', listingsRoutes);
app.use('/api/saved', savedRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Ivy Homes Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});