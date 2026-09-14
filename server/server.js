// // import express from 'express';
// // import cors from 'cors';
// // import dotenv from 'dotenv';
// // import analyticsRoutes from './routes/analyticsRoutes.js';
// // import listingsRoutes from './routes/listingsRoutes.js';
// // import savedRoutes from './routes/savedRoutes.js';

// // dotenv.config();

// // const app = express();
// // const PORT = process.env.PORT || 5000;

// // app.use(cors());
// // app.use(express.json());


// // // API Routes
// // app.use('/api/analytics', analyticsRoutes);
// // app.use('/api/listings', listingsRoutes);
// // app.use('/api/saved', savedRoutes);

// // app.get('/api/health', (req, res) => {
// //   res.json({ status: 'ok', message: 'Ivy Homes Server is running' });
// // });

// // app.listen(PORT, () => {
// //   console.log(`Server running on http://localhost:${PORT}`);
// // });


// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import analyticsRoutes from './routes/analyticsRoutes.js';
// import listingsRoutes from './routes/listingsRoutes.js';
// import savedRoutes from './routes/savedRoutes.js';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Correct CORS setup
// app.use(
//   cors({
//     origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//   })
// );

// app.use(express.json());

// // API Routes
// app.use('/api/analytics', analyticsRoutes);
// app.use('/api/listings', listingsRoutes);
// app.use('/api/saved', savedRoutes);

// app.get('/api/health', (req, res) => {
//   res.json({ status: 'ok', message: 'Ivy Homes Server is running' });
// });

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });


import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import analyticsRoutes from './routes/analyticsRoutes.js';
import listingsRoutes from './routes/listingsRoutes.js';
import savedRoutes from './routes/savedRoutes.js';
import authRoutes from './routes/authRoutes.js'; // <-- Auth import kiya

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Correct CORS setup
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes); // <-- Auth route add kiya
app.use('/api/analytics', analyticsRoutes);
app.use('/api/listings', listingsRoutes);
app.use('/api/saved', savedRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Ivy Homes Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});