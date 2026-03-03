import express from 'express';
import { Board } from '../models/index.js';
import { updateBaseBoard, updateDailyBoard } from '../services/index.js';
import {
  removeBoss,
  replaceUsername,
  getPreviousMonthKey,
} from '../utils/index.js';

const router = express.Router();

router.get('/update-board-base/:date', (req, res) => {
  updateBaseBoard(req.params.date).catch((err) =>
    console.error('❌ error:', err.message),
  );
  res.end();
});

router.get('/update-board-daily', (_, res) => {
  updateDailyBoard().catch((err) => console.error('❌ error:', err.message));
  res.end();
});

router.get('/leaderboard/current', async (_, res) => {
  try {
    const board = await Board.findOne({ type: 'daily' });
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

router.get('/leaderboard/previous', async (_, res) => {
  try {
    const monthKey = getPreviousMonthKey();
    const board = await Board.findOne({ month: monthKey, type: 'base' });
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
