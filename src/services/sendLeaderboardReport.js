import { bot } from '../utils/index.js';
import { Board } from '../models/index.js';
import {
  getPreviousMonthKey,
  getPrizeAndBonus,
  removeBoss,
  replaceUsername,
} from '../utils/index.js';

export const sendLeaderboardReport = async () => {
  try {
    const prevMonth = getPreviousMonthKey();
    const dailyBoard = await Board.findOne({ month: prevMonth, type: 'base' });

    if (!dailyBoard) {
      console.log('❌ Daily документ не найден');
      return;
    }

    const withoutBoss = removeBoss(dailyBoard.players);
    const withNicknames = await replaceUsername(withoutBoss);
    const withPrizes = getPrizeAndBonus(withNicknames);

    const leaderboard = [
      `🏁 Итоги <a href="https://storo08.com/leaderboard"><b>storo08 LEADERboard</b></a>`,
    ];

    leaderboard.push(
      `🎉 Поздравляем всех призёров прошедшего лидерборда и желаем удачи в новом месяце!\n`,
    );

    withPrizes.slice(0, 45).forEach((player) => {
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
      `46-61. ${withPrizes[45].prize} | 62-75. ${withPrizes[61].prize} | 76-100. ${withPrizes[75].prize}`,
    );

    const message = await bot.sendMessage(
      process.env.CHANNEL_ID,
      leaderboard.join('\n'),
      {
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '🏆 Лидерборд',
                url: 'https://storo08.com/leaderboard',
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
