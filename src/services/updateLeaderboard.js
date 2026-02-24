import { Board } from '../models/index.js';
import { getTournaments, calculatePoints } from '../utils/index.js';

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function mergePlayers(existingPlayers, newPlayersArray) {
  console.log('\n🔍 MERGE PLAYERS ДИАГНОСТИКА');
  console.log(`Существующих игроков: ${existingPlayers.length}`);
  console.log(`Новых игроков: ${newPlayersArray.length}`);
  
  
  const playersMap = new Map();
  
  // Добавляем существующих
  existingPlayers.forEach(p => {
    const safePoints = isNaN(p.points) ? 0 : p.points;
    if (isNaN(p.points)) {
      console.log(`⚠️ Исправляем NaN у ${p.username} → 0`);
    }
    playersMap.set(p.username, { username: p.username, points: safePoints });
  });
  
  // Добавляем новых
  newPlayersArray.forEach(({ username, points }) => {
    const safePoints = isNaN(points) ? 0 : points;
    if (isNaN(points)) {
      console.log(`⚠️ Исправляем NaN у нового игрока ${username} → 0`);
    }
    
    if (playersMap.has(username)) {
      const current = playersMap.get(username).points;
      playersMap.get(username).points = current + safePoints;
    } else {
      playersMap.set(username, { username, points: safePoints });
    }
  });
  
  // Финальная проверка
  const result = Array.from(playersMap.values());
  const resultNaN = result.filter(p => isNaN(p.points));
  if (resultNaN.length > 0) {
    console.log(`❌ КРИТИЧНО: после мержа остались NaN: ${resultNaN.length}`);
  } else {
    console.log(`✅ Все NaN исправлены, результат чист`);
  }
  
  return result.sort((a, b) => b.points - a.points);
}

// Основная функция ежедневного обновления
export const updateLeaderboard = async () => {
  try {
    console.log('\n🔄 Ежедневное обновление лидерборда...');

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayStr = formatDate(today);
    const yesterdayStr = formatDate(yesterday);
    const monthKey = todayStr.slice(0, 7);

    // Получаем оба документа
    let baseBoard = await Board.findOne({ month: monthKey, type: 'base' });
    let dailyBoard = await Board.findOne({ month: monthKey, type: 'daily' });

    // ===== ШАГ 1: Проверяем и обрабатываем вчерашний день =====
    if (!baseBoard || !baseBoard.processedDays.includes(yesterdayStr)) {
      console.log(`📅 Вчерашний день ${yesterdayStr} не обработан`);

      // Скачиваем вчерашние турниры
      const yesterdayTournaments = await getTournaments(yesterdayStr);
      const yesterdayPoints = calculatePoints(yesterdayTournaments);

      if (!baseBoard) {
        // Создаем новую base доску
        baseBoard = new Board({
          month: monthKey,
          type: 'base',
          players: yesterdayPoints,
          processedDays: [yesterdayStr],
        });
        console.log(`🟡 Создана новая base доска за ${monthKey}`);
      } else {
        // Мерджим с существующей
        baseBoard.players = mergePlayers(baseBoard.players, yesterdayPoints);
        baseBoard.processedDays.push(yesterdayStr);
        baseBoard.processedDays.sort();
      }

      await baseBoard.save();
      console.log(`✅ Вчерашний день ${yesterdayStr} добавлен в base`);
    }

    // ===== ШАГ 2: Обновляем daily =====
    console.log(`📥 Загружаем данные за сегодня (${todayStr})...`);
    const todayTournaments = await getTournaments(todayStr);
    const todayPoints = calculatePoints(todayTournaments);

    if (!dailyBoard) {
      dailyBoard = new Board({
        month: monthKey,
        type: 'daily',
        players: todayPoints,
        processedDays: [todayStr],
      });
    } else {
      dailyBoard.players = todayPoints;
      dailyBoard.processedDays = [todayStr];
    }

    await dailyBoard.save();
    console.log(`✅ Daily обновлен за ${todayStr}`);

    // ===== ШАГ 3: Проверка на конец месяца =====
    if (checkIfLastDay(today)) {
      console.log(`📅 Сегодня последний день месяца ${monthKey}`);
    }

    return { baseBoard, dailyBoard };
  } catch (error) {
    console.error('❌ Ошибка обновления:', error);
    throw error;
  }
};
