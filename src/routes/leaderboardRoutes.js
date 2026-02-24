import express from 'express';
import { Board } from '../models/index.js';
import {
  getTournaments,
  calculatePoints,
  mergePlayers,
} from '../utils/index.js';

const router = express.Router();

// Скачивает день и добавляет в base (накопленные данные)
router.get('/download-base/:date', async (req, res) => {
  const { date } = req.params;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).send('Неверный формат даты YYYY-MM-DD');
  }

  try {
    const monthKey = date.slice(0, 7); // "2026-02"
    console.log(`📊 Загружаем турниры за ${date}...`);
    const tournaments = await getTournaments(date);
    const dailyPoints = calculatePoints(tournaments);

    let baseBoard = await Board.findOne({ month: monthKey, type: 'base' });

    if (!baseBoard) {
      // Первый день месяца - создаем новый base
      console.log(`🟡 Создаем новый base за ${monthKey}`);
      baseBoard = new Board({
        month: monthKey,
        type: 'base',
        players: dailyPoints,
        processedDays: [date],
      });

      // Сохраняем новую доску
      await baseBoard.save();
      console.log(`✅ База создана и сохранена`);
    } else {
      // Проверяем, не обработан ли уже этот день
      if (baseBoard.processedDays.includes(date)) {
        console.log(`⏭️ День ${date} уже есть в base, пропускаем`);
        return res.json({
          message: `День ${date} уже есть в base`,
          board: baseBoard,
        });
      }

      baseBoard.players = mergePlayers(baseBoard.players, dailyPoints);
      baseBoard.processedDays.push(date);
      baseBoard.processedDays.sort();

      await baseBoard.save();
    }

    console.log(`✅ День ${date} добавлен в base`);

    // 6. Отправляем ответ
    res.json({
      success: true,
      message: `День ${date} успешно добавлен в base`,
      stats: {
        month: monthKey,
        playersCount: baseBoard.players.length,
        processedDays: baseBoard.processedDays,
        newPlayers: dailyPoints.length,
      },
    });
  } catch (error) {
    console.error(`❌ Ошибка:`, error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.get('/update-daily/:date', async (req, res) => {
  const { date } = req.params;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).send('Неверный формат даты YYYY-MM-DD');
  }

  try {
    console.log(`\n📥 GET /update-daily/${date}`);

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

    // 5. Обновляем processedDays (base дни + сегодня)
    const updatedProcessedDays = [...baseBoard.processedDays];
    if (!updatedProcessedDays.includes(date)) {
      updatedProcessedDays.push(date);
      updatedProcessedDays.sort();
    }

    // 6. Сохраняем в daily
    let dailyBoard = await Board.findOne({ month: monthKey, type: 'daily' });

    if (!dailyBoard) {
      console.log(`🟡 Создаем новый daily за ${monthKey}`);
      dailyBoard = new Board({
        month: monthKey,
        type: 'daily',
        players: mergedPlayers,
        processedDays: updatedProcessedDays,
      });
    } else {
      console.log(`🔄 Обновляем существующий daily`);
      dailyBoard.players = mergedPlayers;
      dailyBoard.processedDays = updatedProcessedDays;
    }

    await dailyBoard.save();
    console.log(`✅ Daily сохранен за ${monthKey} с данными по ${date}`);

    // 7. Отправляем ответ
    res.json({
      success: true,
      message: `Daily обновлен данными за ${date}`,
      stats: {
        month: monthKey,
        baseDays: baseBoard.processedDays.length,
        basePlayers: baseBoard.players.length,
        dailyPlayers: dailyBoard.players.length,
        todayPlayers: todayPoints.length,
        processedDays: dailyBoard.processedDays,
      },
      // Топ-5 для интереса
      topPlayers: dailyBoard.players.slice(0, 5),
    });
  } catch (error) {
    console.error(`❌ Ошибка:`, error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
