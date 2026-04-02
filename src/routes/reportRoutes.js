import express from 'express';
import { Board, chaseBoard } from '../models/index.js';
import {
  removeBoss,
  getPreviousMonthKey,
  getPrizeAndBonus,
} from '../utils/index.js';

const router = express.Router();

// Функция для получения названия месяца и года из monthKey
const getMonthYearFromKey = (monthKey) => {
  const [year, month] = monthKey.split('-');
  const monthNames = [
    'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
    'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь',
  ];
  const monthName = monthNames[parseInt(month) - 1];
  return { year, monthName };
};

// Функция расчета приза для chase
const getPrize = (rake) => {
  if (rake < 1000) return 0;
  if (rake < 1500) return 50;
  if (rake < 2000) return 75;
  if (rake < 3000) return 100;
  if (rake < 4000) return 150;
  if (rake < 5000) return 200;
  if (rake < 6000) return 250;
  if (rake < 7500) return 300;
  return Math.floor(rake / 1500) * 75;
};

router.get('/report/leaderboard', async (_, res) => {
  try {
    const monthKey = getPreviousMonthKey();
    const board = await Board.findOne({ month: monthKey, type: 'base' });
    const withoutBoss = removeBoss(board.players).slice(0, 100);
    const reportList = getPrizeAndBonus(withoutBoss);

    const { year, monthName } = getMonthYearFromKey(monthKey);
    const reportTitle = `Логины и призы storo08 Leaderboard за ${monthName} ${year} года`;
    const fileName = `storo08leaderboard-${monthKey}.txt`;

    const reportLines = [reportTitle, ''];

    reportList.forEach((player) => {
      const bonusText = player.bonus ? ` + ${player.bonus}x Билет €100` : '';
      reportLines.push(
        `${player.position}. ${player.username} - ${player.prize}${bonusText}`,
      );
    });

    const reportText = reportLines.join('\n');

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.send(reportText);
  } catch (error) {
    console.error('❌ error:', error);
    res.status(500).send('error: ' + error.message);
  }
});

router.get('/report/chase', async (_, res) => {
  try {
    const monthKey = getPreviousMonthKey();
    const board = await chaseBoard.findOne({ month: monthKey, type: 'base' });
    const withoutBoss = removeBoss(board.players);
    
    const reportList = withoutBoss
      .map(player => ({
        username: player.username,
        prize: getPrize(player.points)
      }))
      .filter(player => player.prize > 0);

    const { year, monthName } = getMonthYearFromKey(monthKey);
    const reportTitle = `Выплаты storo08 Race Chase за ${monthName} ${year} года`;
    const fileName = `storo08chase-${monthKey}.txt`;

    const reportLines = [reportTitle, ''];

    reportList.forEach((player) => {
      reportLines.push(`${player.username} - ${player.prize}`);
    });

    const reportText = reportLines.join('\n');

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.send(reportText);
    
  } catch (error) {
    console.error('❌ error:', error);
    res.status(500).send('error: ' + error.message);
  }
});

export default router;