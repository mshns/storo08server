import { chaseBoard } from '../models/index.js';
import { getRake, mergePlayers, removeBoss } from '../utils/index.js';

export const updateDailyChase = async (date) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error('invalid date format YYYY-MM-DD');
  }

  const monthKey = date.slice(0, 7);

  let baseBoard = await chaseBoard.findOne({ month: monthKey, type: 'base' });

  if (!baseBoard) {
    return res.status(404).json({
      error: `Base за ${monthKey} не найден. Сначала скачай base через /download-base`,
    });
  }

  console.log(
    `📊 Base найден: ${baseBoard.players.length} игроков, дней: ${baseBoard.processedDays.length}`,
  );

  console.log(`📥 Загружаем ${date}...`);
  const dailyRake = await getRake(date);

  const mergedPlayers = mergePlayers(baseBoard.players, dailyRake);
  console.log(`✅ После мержа: ${mergedPlayers.length} игроков`);
  const withoutBoss = removeBoss(mergedPlayers);

  const updatedProcessedDays = [...baseBoard.processedDays];
  if (!updatedProcessedDays.includes(date)) {
    updatedProcessedDays.push(date);
    updatedProcessedDays.sort();
  }

  const dailyBoard = await chaseBoard.findOne({ type: 'daily' });

  console.log(`🔄 Обновляем существующий daily`);
  dailyBoard.month = monthKey;
  dailyBoard.players = withoutBoss;
  dailyBoard.processedDays = updatedProcessedDays;

  await dailyBoard.save();
  console.log(`✅ Daily сохранен за ${monthKey} с данными по ${date}`);
};
