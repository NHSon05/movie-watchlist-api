import { prisma } from '../config/db.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

const addMovieToWatchlist = async (req, res) => {
  const { movieId, status, rating, notes, userId } = req.body;
  // Verify movie exists
  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
  });

  if (!movie) {
    return res
      .status(HTTP_STATUS.NOT_FOUND)
      .json({ message: 'Movie not found' });
  }

  // Check if already added
  const existingInWatchList = await prisma.watchlistItem.findUnique({
    where: {
      userId_movieId: {
        userId: userId,
        movieId: movieId,
      },
    },
  });

  if (existingInWatchList) {
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ message: 'Movie already in watchlist' });
  }

  const watchlistItem = await prisma.watchlistItem.create({
    data: {
      userId,
      movieId,
      status: status || 'PLANNED',
      rating,
      notes,
    },
  });

  res.status(HTTP_STATUS.CREATED).json({
    status: 'success',
    data: {
      watchlistItem,
    },
    message: 'Movie added to watchlist successfully',
  });
};
const removeMovieFromWatchlist = () => {};
const getWatchlist = () => {};
const updateWatchlistItem = () => {};

export {
  addMovieToWatchlist,
  removeMovieFromWatchlist,
  getWatchlist,
  updateWatchlistItem,
};
