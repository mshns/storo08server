import { bot } from '../utils/index.js';
import { Board } from '../models/index.js';
import {
  getPrizeAndBonus,
  removeBoss,
  replaceUsername,
} from '../utils/index.js';

export const sendLeaderboard = async () => {
  try {
    const dailyBoard = await Board.findOne({ type: 'daily' });

    if (!dailyBoard) {
      console.log('❌ Daily документ не найден');
      return;
    }

    const withoutBoss = removeBoss(dailyBoard.players);
    const withNicknames = await replaceUsername(withoutBoss);
    const withPrizes = getPrizeAndBonus(withNicknames);

    const leaderboard = [
      `🏁 <a href="https://www.vigorish.ru/section84/topic13528.html"><b>storo08 LEADERboard</b></a>`,
    ];

    const updateMSK = new Date(dailyBoard.updatedAt);
    // updateMSK.setHours(updateMSK.getHours() + 3);

    const dateOptions = { month: 'long', day: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit' };

    const date = updateMSK.toLocaleString('ru', dateOptions);
    const time = updateMSK.toLocaleString('ru', timeOptions);

    leaderboard.push(`<i>Обновлено ${date} в ${time} по мск.</i>\n`);

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
      `46-${withPrizes.length}. <a href="https://mshns.github.io/storo08leaderboard/"> Остальные участники лидерборда</a>`,
    );

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
