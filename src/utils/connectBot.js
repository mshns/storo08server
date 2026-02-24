import TelegramBot from 'node-telegram-bot-api';

const token = process.env.BOT_TOKEN;

export const bot = new TelegramBot(token, { polling: true });

// Функция показа главного меню
async function showMainMenu(chatId) {
  await bot.sendMessage(
    chatId,
    '♠️ <b>RedStar + storo08</b>\n\nРегистрируйтесь на RedStar с промокодом storo08 и получай рейкбек до 60%! \nВыбери, что тебя интересует:',
    {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{ text: '🎁 Рейкбек до 60%', callback_data: 'rakeback' }],
          [{ text: '🏆 Leaderboard', callback_data: 'leaderboard' }],
          [{ text: '💰 Race Chase', callback_data: 'race_chase' }],
          [
            { text: '🎯 Twister Challenge', callback_data: 'twister' },
            { text: '⚔️ HU Challenge', callback_data: 'hu' },
          ],
          [{ text: '📝 Регистрация', callback_data: 'register' }],
          [{ text: '❓ Частые вопросы', callback_data: 'faq' }],
        ],
      },
    },
  );
}

// Функция отправки с кнопкой меню
async function sendWithMenuButton(chatId, text) {
  await bot.sendMessage(chatId, text, {
    parse_mode: 'HTML',
    disable_web_page_preview: true,
    reply_markup: {
      inline_keyboard: [
        [{ text: '🏠 Главное меню', callback_data: 'back_to_menu' }],
      ],
    },
  });
}

// Экспортируем функцию для подключения
export const connectBot = () => {
  // Обработчик команд
  bot.onText(/\/start|\/menu/, async (msg) => {
    const chatId = msg.chat.id;
    await showMainMenu(chatId);
  });

  // Обработчик нажатий на кнопки
  bot.on('callback_query', async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;

    // Кнопка возврата в меню
    if (data === 'back_to_menu') {
      await showMainMenu(chatId);
      await bot.answerCallbackQuery(callbackQuery.id);
      return;
    }

    switch (data) {
      case 'rakeback':
        await sendWithMenuButton(
          chatId,
          '🎁 <b>Рейкбек до 60% на RedStar</b>\n\n' +
            'Зарегистрируйся с промокодом <b>storo08</b> и получай:\n\n' +
            "• <b>35%</b> — базовый рейкбек при статусе 'star'\n" +
            '• <b>5-10%</b> — ежеквартальные релоад-бонусы\n' +
            '• <b>~5%</b> — Race Chase (ежемесячно)\n' +
            '• <b>5-10%</b> — Leaderboard (ежемесячно)\n' +
            '• <b>~8-10%</b> — Twister Challenge\n' +
            '• <b>Free</b> — HU Challenge (фрироллы)\n\n' +
            '➕ <b>Бонус 200%</b> на первый депозит!',
        );
        break;

      case 'leaderboard':
        const top3 =
          '1. time1ess — 31.6M баллов\n2. GOiDriver — 22.6M баллов\n3. VALARMQRGHULIS — 16.6M баллов';

        await sendWithMenuButton(
          chatId,
          '🏆 <b>storo08 Leaderboard</b>\n\n' +
            'Ежемесячная приватная гонка для игроков Twister, SNG и MTT.\n' +
            '💰 <b>Призовой фонд: T€6000 в месяц!</b>\n\n' +
            'Топ-3 сейчас:\n' +
            `${top3}\n\n` +
            '🎁 <b>Бонус:</b> за каждые 10M баллов — билет €100!\n\n' +
            "📍 <a href='https://redstar.storo08.ru/leaderboard/'>Полный лидерборд</a>",
        );
        break;

      case 'race_chase':
        await sendWithMenuButton(
          chatId,
          '💰 <b>storo08 Race Chase</b>\n\n' +
            'Ежемесячный дополнительный рейкбек <b>~5%</b> для всех игроков!\n\n' +
            '• Кэш, MTT, SnG — все игры считаются\n' +
            '• Выплаты в первой неделе следующего месяца\n' +
            '• Начисление напрямую на счёт в руме\n\n' +
            "📍 <a href='https://storo08.ru/chase/'>Узнать свою выплату</a>",
        );
        break;

      case 'twister':
        await sendWithMenuButton(
          chatId,
          '🎯 <b>storo08 Twister Challenge</b>\n\n' +
            'Еженедельные челленджи для игроков низких лимитов (€1, €2, €3):\n\n' +
            '• 500 Twisters → 3 билета\n' +
            '• 900 Twisters → 5 билетов\n' +
            '• 1400 Twisters → 9 билетов\n\n' +
            "📍 <a href='https://www.vigorish.ru/section84/topic13421.html'>Оставить заявку</a>",
        );
        break;

      case 'hu':
        await sendWithMenuButton(
          chatId,
          '⚔️ <b>storo08 Heads-Up Challenge</b>\n\n' +
            'Тренировочные фрироллы в формате хедзап-шутаутов!\n\n' +
            '• Каждую пятницу\n' +
            '• Бесплатный вход\n' +
            "• Баунти за выбивание 'storo08'\n" +
            '• Рандомные призы для всех участников\n\n' +
            "📍 <a href='https://www.vigorish.ru/section84/topic13421.html'>Расписание</a>",
        );
        break;

      case 'register':
        await sendWithMenuButton(
          chatId,
          '📝 <b>Регистрация на RedStar</b>\n\n' +
            '1️⃣ Перейди по ссылке:\n' +
            "<a href='https://c.rsppartners.com/clickthrgh?btag=a_9631b_75l_9'>Регистрация RedStar</a>\n\n" +
            '2️⃣ Введи промокод: <b>storo08</b>\n\n' +
            '3️⃣ Получи:\n' +
            '• 🎁 Бонус 200% на первый депозит\n' +
            '• 💰 Рейкбек до 60%\n' +
            '• 🏆 Доступ ко всем приватным акциям\n\n' +
            "📍 <a href='https://c.rsppartners.com/clickthrgh?btag=a_9631b_75l_9'>Перейти к регистрации</a>",
        );
        break;

      case 'faq':
        await sendWithMenuButton(
          chatId,
          '❓ <b>Частые вопросы</b>\n\n' +
            '🔹 <b>Как получить рейкбек?</b>\n' +
            'Зарегистрируйся с кодом storo08 и играй — рейкбек начисляется автоматически.\n\n' +
            '🔹 <b>Когда выплаты?</b>\n' +
            'Race Chase — в начале месяца\n' +
            'Leaderboard — после окончания гонки\n\n' +
            '🔹 <b>Как участвовать в Twister Challenge?</b>\n' +
            'Играй Twister €1-3, оставь заявку по ссылке.\n\n' +
            '🔹 <b>Есть поддержка?</b>\n' +
            'Да! Пиши — всегда поможем 🤝',
        );
        break;
    }

    // Убираем "часики" на кнопке
    await bot.answerCallbackQuery(callbackQuery.id);
  });

  console.log('🤖 Меню бота с навигацией подключено!');
};
