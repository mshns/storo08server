import { Board } from '../models/index.js';
import {
  getCurrentDate,
  getTournaments,
  calculatePoints,
  mergePlayers,
  removeBoss,
  replaceUsername,
} from '../utils/index.js';

export const updateDailyBoard = async () => {
  const today = getCurrentDate();
  const monthKey = today.slice(0, 7);

  const tournaments = await getTournaments(today);
  const todayPoints = calculatePoints(tournaments);

  const baseBoard = await Board.findOne({ month: monthKey, type: 'base' });

  const mergedPlayers = baseBoard
    ? mergePlayers(baseBoard.players, todayPoints)
    : todayPoints.sort((a, b) => b.points - a.points);

  const withoutBoss = removeBoss(mergedPlayers);
  const withNicknames = await replaceUsername(withoutBoss);

  const updatedProcessedDays = [today];

  const dailyBoard = await Board.findOne({ type: 'daily' });

  dailyBoard.month = monthKey;
  dailyBoard.players = withNicknames;
  dailyBoard.processedDays = updatedProcessedDays;

  await dailyBoard.save();
  console.log(`✅ daily leaderboard update for ${today} completed`);
};
