import express from 'express';
import { Board } from '../models/index.js';

import { updateBaseBoard, updateDailyBoard } from '../services/index.js';
import { removeBoss, replaceUsername } from '../utils/index.js';

const getPreviousMonthKey = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const prevYear = month === 0 ? year - 1 : year;
  const prevMonth = month === 0 ? 11 : month - 1;

  return `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}`;
};

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

router.get('/leaderboard/current', (_, res) => {
  Board.findOne({ type: 'daily' }).then((board) => {
    res.status(200).json(board);
  });
});

router.get('/leaderboard/previous', async (_, res) => {
  try {
    const monthKey = getPreviousMonthKey();

    const board = await Board.findOne({ month: monthKey, type: 'base' });

    if (!board) {
      return res.status(404).json({ error: 'Data not found' });
    }

    const withoutBoss = removeBoss(board.players);

    const withNicknames = await replaceUsername(withoutBoss);

    res.status(200).json({
      players: withNicknames,
      updatedAt: board.updatedAt,
    });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
