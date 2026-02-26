import express from 'express';

import { updateBaseBoard, updateDailyBoard } from '../services/index.js';

const router = express.Router();

router.get('/download-base/:date', (req, res) => {
  updateBaseBoard(req.params.date).catch((err) =>
    console.error('❌ error:', err.message),
  );
  res.end();
});

router.get('/update-daily/:date', (req, res) => {
  updateDailyBoard(req.params.date).catch((err) =>
    console.error('❌ error:', err.message),
  );
  res.end();
});

export default router;
