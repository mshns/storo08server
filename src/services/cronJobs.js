import cron from 'node-cron';
import {
  updateBaseBoard,
  updateBaseChase,
  updateDailyBoard,
  updateDailyChase,
  sendFreeroll,
  sendLeaderboard,
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

  // run at 9:05, 12:05, 15:05, 18:05 and 21:05 every day
  cron.schedule('5 9,12,15,18,21 * * *', () => {
    updateDailyChase();
  });

  // run at 9:35 and 18:35 every day
  cron.schedule('35 9,18 * * *', () => {
    updateDailyBoard();
  });

  // run at 10:05 every day
  cron.schedule('5 10 * * *', () => {
    sendLeaderboard();
  });

  // run at 5:00 pm on fridays
  cron.schedule('0 17 * * 5', () => {
    sendFreeroll();
  });
};

export default cronJobs;
