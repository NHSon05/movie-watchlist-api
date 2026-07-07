import express from 'express';
import {
  addMovieToWatchlist,
  removeMovieFromWatchlist,
  getWatchlist,
  updateWatchlistItem,
} from '../controllers/watchlist.controller.js';

const router = express.Router();

router.post('/', addMovieToWatchlist);
router.get('/', getWatchlist);
router.delete('/:id', removeMovieFromWatchlist);
router.put('/:id', updateWatchlistItem);

export default router;
