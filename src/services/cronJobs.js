import cron from 'node-cron';
import {
  updateBaseBoard,
  updateBaseChase,
  updateDailyBoard,
  updateDailyChase,
  sendFreeroll,
  sendLeaderboard,
  sendLeaderboardReport,
} from './index.js';
import { getPreviousDate } from '../utils/index.js';

const cronJobs = () => {
  // run at 8:05 every day
  cron.schedule('5 8 * * *', () => {
    const date = getPreviousDate();
    updateBaseChase(date);
  });

  // run at 8:35 every day
  cron.schedule('35 8 * * *', () => {
    const date = getPreviousDate();
    updateBaseBoard(date);
  });

  // run at 5 minutes past every hour from 9 to 23
  cron.schedule('5 9-23 * * *', updateDailyChase);

  // run at 35 minutes past every hour from 9 to 23
  cron.schedule('35 9-23 * * *', updateDailyBoard);

  // run at 10:35 every day
  cron.schedule('45 11 * * *', sendLeaderboard);

  // run at 5:00 pm on fridays
  cron.schedule('0 17 * * 5', sendFreeroll);

  // run at 8:45 on the first day of the month
  cron.schedule('45 8 1 * *', sendLeaderboardReport);
};

export default cronJobs;
