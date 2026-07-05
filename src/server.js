import express from 'express';
import { config } from 'dotenv';
import { connectDB, disconnectDB } from './config/db.js';

// import Routes
import movieRoutes from './routes/movie.route.js';

config();
connectDB();

const app = express();

// API Routes
app.use('/movies', movieRoutes);

const PORT = 5001;
// app sẽ chạy trên PORT này
app.listen(PORT, () => {
  console.log(`server is running on PORT ${PORT}`);
});

// GET, POST, PUT, DELETE

// xử lý khi server dừng

process.on('unhandledRejection', async (err) => {
  console.error(`unhandledRejection error: ${err.message}`);
  await disconnectDB();
  process.exit(1);
});

process.on('uncaughtException', async (err) => {
  console.error(`uncaughtException error: ${err.message}`);
  await disconnectDB();
  process.exit(1);
});

process.on('SIGTERM', async () => {
  await disconnectDB();
  process.exit(0);
});

// Authentication - signin, signup
// movie - getting all movie
// user - profile
// watchlist
