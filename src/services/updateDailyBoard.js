import { Board } from '../models/index.js';
import {
  getTournaments,
  calculatePoints,
  mergePlayers,
  removeBoss,
  replaceUsername,
} from '../utils/index.js';

export const updateDailyBoard = async (date) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error('invalid date format YYYY-MM-DD');
  }

  const monthKey = date.slice(0, 7);

  // 1. Получаем base (данные за месяц)
  const baseBoard = await Board.findOne({ month: monthKey, type: 'base' });

  if (!baseBoard) {
    return res.status(404).json({
      error: `Base за ${monthKey} не найден. Сначала скачай base через /download-base`,
    });
  }

  console.log(
    `📊 Base найден: ${baseBoard.players.length} игроков, дней: ${baseBoard.processedDays.length}`,
  );

  console.log(`📥 Загружаем турниры за ${date}...`);
  const tournaments = await getTournaments(date);

  // 3. Считаем очки за сегодня
  const todayPoints = calculatePoints(tournaments);
  console.log(`👥 Уникальных игроков за ${date}: ${todayPoints.length}`);

  // 4. Мерджим base + сегодня
  console.log(
    `🔄 Мержим base (${baseBoard.players.length}) + today (${todayPoints.length})...`,
  );
  const mergedPlayers = mergePlayers(baseBoard.players, todayPoints);
  console.log(`✅ После мержа: ${mergedPlayers.length} игроков`);

  const withoutBoss = removeBoss(mergedPlayers);
  const withNicknames = await replaceUsername(withoutBoss);
  // 5. Обновляем processedDays (base дни + сегодня)
  const updatedProcessedDays = [...baseBoard.processedDays];
  if (!updatedProcessedDays.includes(date)) {
    updatedProcessedDays.push(date);
    updatedProcessedDays.sort();
  }

  // 6. Сохраняем в daily
  const dailyBoard = await Board.findOne({ type: 'daily' });

  console.log(`🔄 Обновляем существующий daily`);
  dailyBoard.month = monthKey;
  dailyBoard.players = withNicknames;
  dailyBoard.processedDays = updatedProcessedDays;

  await dailyBoard.save();
  console.log(`✅ Daily сохранен за ${monthKey} с данными по ${date}`);
};
