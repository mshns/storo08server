import { bot } from '../utils/index.js';
import { Board, Player } from '../models/index.js';
import { getPrizeAndBonus } from '../utils/index.js';

export const sendLeaderboard = async () => {
  try {
    console.log('📤 Формируем лидерборд для Telegram...');

    // 1. Получаем daily документ
    const dailyBoard = await Board.findOne({ type: 'daily' });

    if (!dailyBoard) {
      console.log('❌ Daily документ не найден');
      return;
    }

    // Исключаем босса сразу!
    const filteredPlayers = dailyBoard.players.filter(
      (player) => player.username !== 'sanchess08',
    );

    console.log(`📊 Найдено игроков в daily: ${dailyBoard.players.length}`);
    console.log(`📊 После исключения босса: ${filteredPlayers.length}`);

    // 2. Получаем всех игроков для маппинга логинов в никнеймы
    const players = await Player.find({});
    const nicknameMap = new Map();
    players.forEach((player) => {
      nicknameMap.set(player.login, player.nickname);
    });

    // 3. Заменяем логины на никнеймы
    const playersWithNicknames = filteredPlayers // ← используем отфильтрованный массив
      .slice(0, 45)
      .map((player) => {
        const nickname = nicknameMap.get(player.username) || player.username;
        return {
          username: nickname,
          points: player.points,
        };
      });

    // 4. Применяем функцию getPrizeAndBonus
    const formattedPlayers = getPrizeAndBonus(playersWithNicknames);

    // 6. Формируем заголовок
    const leaderboard = [
      `🏁 <a href="https://www.vigorish.ru/section84/topic13528.html"><b>storo08 LEADERboard</b></a>`,
    ];

    // 7. Добавляем время обновления (+3 часа для МСК)
    const updateMSK = new Date(dailyBoard.updatedAt);
    // updateMSK.setHours(updateMSK.getHours() + 3);

    const dateOptions = { month: 'long', day: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit' };

    const date = updateMSK.toLocaleString('ru', dateOptions);
    const time = updateMSK.toLocaleString('ru', timeOptions);

    leaderboard.push(`<i>Обновлено ${date} в ${time} по мск.</i>\n`);

    // 8. Добавляем топ-45 в сообщение
    formattedPlayers.forEach((player) => {
      const prizeText = `💰 <b>${player.prize}</b>`;
      let bonusText = '';
      if (player.bonus > 0) {
        bonusText = `\n⭐ Бонус <b>${player.bonus}х билет €100</b> за ${player.bonus * 10}M баллов`;
      }

      leaderboard.push(
        `${player.position}. <b>${player.username}</b> » ${player.points.toLocaleString('ru')} ${prizeText}${bonusText}`,
      );
    });

    leaderboard.push(
      `46-${filteredPlayers.length}. <a href="https://mshns.github.io/storo08leaderboard/"> Остальные участники лидерборда</a>`,
    );

    // 10. Отправляем в Telegram
    const message = await bot.sendMessage(
      process.env.CHAT_ID,
      leaderboard.join('\n'),
      {
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '🏆 Лидерборд',
                url: 'https://mshns.github.io/storo08leaderboard/',
              },
              {
                text: '🎁 Призы',
                url: 'https://www.vigorish.ru/section84/topic13528.html',
              },
            ],
          ],
        },
      },
    );

    console.log(`✅ Лидерборд отправлен в Telegram`);

    // 11. Автоудаление (как в старом коде)
    const delay =
      new Date().getHours() < 17 ? 6 * 60 * 60 * 1000 : 12 * 60 * 60 * 1000;

    setTimeout(() => {
      bot
        .deleteMessage(process.env.CHAT_ID, message.message_id)
        .then(() => console.log('🗑️ Сообщение удалено'))
        .catch((err) => console.log('❌ Ошибка удаления:', err.message));
    }, delay);
  } catch (error) {
    console.error('❌ Ошибка отправки лидерборда:', error);
  }
};
