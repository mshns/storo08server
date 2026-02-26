import { Board, Player } from '../models/index.js';
import { getPrizeAndBonus, removeBoss } from '../utils/index.js';

export const getLeaderboard = async (date) => {
  const dailyBoard = await Board.findOne({ type: 'daily' });

  if (!dailyBoard) {
    console.log('❌ Daily документ не найден');
    return;
  }

  const withoutBoss = removeBoss(dailyBoard.players);
  const withNicknames = await replaceUsername(withoutBoss);
  const withPrizes = getPrizeAndBonus(withNicknames);
};
