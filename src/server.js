import 'dotenv/config';
import express from 'express';
import { connectDB, disconnectDB } from './config/db.js';

// import Routes
import movieRoutes from './routes/movie.route.js';
import authRoutes from './routes/auth.route.js';

connectDB();

const app = express();

// Body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/movies', movieRoutes);
app.use('/auth', authRoutes);

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
