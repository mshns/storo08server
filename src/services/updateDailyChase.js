import { chaseBoard } from '../models/index.js';
import {
  getCurrentDate,
  getRake,
  mergePlayers,
  removeBoss,
} from '../utils/index.js';

export const updateDailyChase = async () => {
  const today = getCurrentDate();
  const monthKey = today.slice(0, 7);

  const dailyRake = await getRake(today);

  const baseBoard = await chaseBoard.findOne({ month: monthKey, type: 'base' });

  const mergedPlayers = baseBoard
    ? mergePlayers(baseBoard.players, dailyRake)
    : dailyRake.sort((a, b) => b.points - a.points);

  const withoutBoss = removeBoss(mergedPlayers);

  const updatedProcessedDays = [today];

  const dailyBoard = await chaseBoard.findOne({ type: 'daily' });

  dailyBoard.month = monthKey;
  dailyBoard.players = withoutBoss;
  dailyBoard.processedDays = updatedProcessedDays;

  await dailyBoard.save();
  console.log(`✅ daily chase update for ${today} completed`);
};
