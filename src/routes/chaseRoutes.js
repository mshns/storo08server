import express from 'express';
import { chaseBoard } from '../models/index.js';
import { updateDailyChase, updateBaseChase } from '../services/index.js';
import { removeBoss, getPreviousMonthKey } from '../utils/index.js';

const router = express.Router();

router.get('/update-chase-base/:date', (req, res) => {
  updateBaseChase(req.params.date).catch((err) =>
    console.error('❌ error:', err.message),
  );
  res.end();
});

router.get('/update-chase-daily', (_, res) => {
  updateDailyChase().catch((err) => console.error('❌ error:', err.message));
  res.end();
});

router.get('/chase/current', async (_, res) => {
  try {
    const board = await chaseBoard.findOne({ type: 'daily' });
    const players = board.players.map((player) => ({
      username: player.username,
      points: player.points,
    }));

    res.status(200).json({
      players,
      updatedAt: board.updatedAt,
    });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/chase/previous', async (_, res) => {
  try {
    const monthKey = getPreviousMonthKey();
    const board = await chaseBoard.findOne({ month: monthKey, type: 'base' });
    const withoutBoss = removeBoss(board.players);
    const players = withoutBoss.map((player) => ({
      username: player.username,
      points: player.points,
    }));

    res.status(200).json({
      players,
      updatedAt: board.updatedAt,
    });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
