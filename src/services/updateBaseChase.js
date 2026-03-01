import { chaseBoard } from '../models/index.js';
import { getRake, mergePlayers } from '../utils/index.js';

export const updateBaseChase = async (date) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error('invalid date format YYYY-MM-DD');
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const inputDate = new Date(date);
  inputDate.setHours(0, 0, 0, 0);

  if (inputDate >= today) {
    throw new Error('cannot download base for today or future dates');
  }

  const monthKey = date.slice(0, 7);

  let baseBoard = await chaseBoard.findOne({ month: monthKey, type: 'base' });

  if (!baseBoard) {
    console.log(`🟡 Создаем пустой base за ${monthKey}`);
    baseBoard = new chaseBoard({
      month: monthKey,
      type: 'base',
      players: [],
      processedDays: [],
    });
    await baseBoard.save();
    console.log(`✅ Пустой base создан`);
  }

  if (baseBoard.processedDays.includes(date)) {
    console.log(`📌 ${date} already added`);
    return;
  }

  console.log(`📥 Загружаем ${date}...`);
  const dailyRake = await getRake(date);

  baseBoard.players = mergePlayers(baseBoard.players, dailyRake);
  baseBoard.processedDays.push(date);
  baseBoard.processedDays.sort();

  await baseBoard.save();
  console.log(`✅ ${date} added`);
};
