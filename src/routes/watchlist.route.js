import express from 'express';
import {
  addMovieToWatchlist,
  removeMovieFromWatchlist,
  getWatchlist,
  updateWatchlistItem,
} from '../controllers/watchlist.controller.js';
import { authMiddleware } from '../middlewares/auth.middlewares.js';
import { validateRequest } from '../validators/validate.request.js';
import { addToWatchListSchema } from '../validators/watchList.validators.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', validateRequest(addToWatchListSchema), addMovieToWatchlist);
router.get('/', getWatchlist);
router.delete('/:id', removeMovieFromWatchlist);
router.put('/:id', updateWatchlistItem);

export default router;
