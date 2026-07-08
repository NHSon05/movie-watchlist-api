import z from 'zod';

export const addToWatchListSchema = z.object({
  movieId: z.string().uuid('Movie not found').min(1),
  status: z
    .enum(['PLANNED', 'WATCHING', 'COMPLETED', 'DROPPED'], {
      error: () => ({
        message: 'Status must be one of: PLANNED, WATCHING, COMPLETED, DROPPED',
      }),
    })
    .optional(),
  rating: z
    .number()
    .min(1, 'Rating must be between 1 and 10')
    .max(10, 'Rating must be between 1 and 10')
    .optional(),
  notes: z.string().optional(),
});

export const updateWatchlistSchema = z.object({
  status: z
    .enum(['PLANNED', 'WATCHING', 'COMPLETED', 'DROPPED'], {
      error: () => ({
        message: 'Status must be one of: PLANNED, WATCHING, COMPLETED, DROPPED',
      }),
    })
    .optional(),
  rating: z
    .number()
    .min(1, 'Rating must be between 1 and 10')
    .max(10, 'Rating must be between 1 and 10')
    .optional(),
  notes: z.string().optional(),
});

export const removeFromWatchlistSchema = z.object({
  id: z.string().uuid('Watchlist item not found').min(1),
});
