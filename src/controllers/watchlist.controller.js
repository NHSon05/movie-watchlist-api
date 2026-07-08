import { prisma } from '../config/db.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

const addMovieToWatchlist = async (req, res) => {
  const { movieId, status, rating, notes } = req.body;
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
        userId: req.user.id,
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
      userId: req.user.id,
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
const getWatchlist = async (req, res) => {
  const watchlist = await prisma.watchlistItem.findMany({
    where: { userId: req.user.id },
    include: {
      movie: {
        select: {
          id: true,
          title: true,
          overview: true,
          releaseYear: true,
          genres: true,
          runtime: true,
          posterUrl: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  res.status(HTTP_STATUS.OK).json({
    status: 'success',
    data: {
      watchlist,
    },
    message: 'Watchlist retrieved successfully',
  });
};
const updateWatchlistItem = async (req, res) => {
  const { status, rating, notes } = req.body;

  const validStatuses = ['PLANNED', 'WATCHING', 'COMPLETED', 'DROPPED'];

  if (status !== undefined && !validStatuses.includes(status)) {
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ error: 'Invalid watchlist status' });
  }

  if (
    rating !== undefined &&
    rating !== null &&
    (typeof rating !== 'number' || rating < 0 || rating > 10)
  ) {
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ error: 'Rating must be a number between 0 and 10' });
  }

  try {
    const watchlistItem = await prisma.watchlistItem.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!watchlistItem) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ error: 'Watchlist item not found' });
    }

    const updateData = {};

    if (status !== undefined) updateData.status = status;
    if (rating !== undefined) updateData.rating = rating;
    if (notes !== undefined) updateData.notes = notes;

    if (Object.keys(updateData).length === 0) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: 'No valid fields provided for update' });
    }

    const updatedWatchlistItem = await prisma.watchlistItem.update({
      where: { id: req.params.id },
      data: updateData,
    });

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: {
        watchlistItem: updatedWatchlistItem,
      },
      message: 'Watchlist item updated successfully',
    });
  } catch (error) {
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ error: `Internal server error: ${error}` });
  }
};
const removeMovieFromWatchlist = async (req, res) => {
  try {
    // Find watchlist item and verify ownership

    const watchlistItem = await prisma.watchlistItem.findUnique({
      where: { id: req.params.id },
    });

    if (!watchlistItem) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ error: 'Watch Items not Found' });
    }
    // Ensure only owner can delete
    if (watchlistItem.userId !== req.user.id) {
      return res
        .status(HTTP_STATUS.FORBIDDEN)
        .json({ error: 'Not allowed to delete this watchlist item' });
    }
    await prisma.watchlistItem.delete({
      where: { id: req.params.id },
    });

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      message: 'Movie removed from watchlist successfully',
    });
  } catch (error) {
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ error: `Internal server error: ${error.message}` });
  }
};

export {
  addMovieToWatchlist,
  getWatchlist,
  updateWatchlistItem,
  removeMovieFromWatchlist,
};
