import express from 'express';
import { chaseBoard } from '../models/index.js';

import { updateDailyChase } from '../services/index.js';

const router = express.Router();

router.get('/update-chase-base/:date', (req, res) => {
  updateBaseChase(req.params.date).catch((err) =>
    console.error('❌ error:', err.message),
  );
  res.end();
});

router.get('/update-chase-daily/:date', (req, res) => {
  updateDailyChase(req.params.date).catch((err) =>
    console.error('❌ error:', err.message),
  );
  res.end();
});

router.get('/chase', (_, res) => {
  chaseBoard.findOne({ type: 'daily' }).then((board) => {
    res.status(200).json(board);
  });
});

export default router;
