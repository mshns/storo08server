import TelegramBot from 'node-telegram-bot-api';

const token = process.env.BOT_TOKEN;

export const bot = new TelegramBot(token, { polling: true });

async function showMainMenu(chatId) {
  await bot.sendMessage(
    chatId,
    '<a href="https://c.rsppartners.com/clickthrgh?btag=a_9631b_75l_9">Регистрируйся на RedStar</a> с промокодом <b>storo08</b> и получи бонус 200% на первый депозит, а также возможность участвовать в приватных акциях и получать суммарный рейкбек до 60%!',
    {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Рейкбек 35%', callback_data: 'rakeback' },
            {
              text: 'Релоады 5-10%',
              callback_data: 'reload',
            },
          ],
          [
            { text: 'Race Chase ~5%', callback_data: 'chase' },
            {
              text: 'Leaderboard 5-10%',
              callback_data: 'leaderboard',
            },
          ],
          [
            {
              text: 'Challenge 8-10%',
              callback_data: 'challenge',
            },
            {
              text: 'Фрироллы',
              callback_data: 'freeroll',
            },
          ],
          [{ text: '📝 Регистрация', callback_data: 'register' }],
          [
            { text: '❓ Частые вопросы', callback_data: 'faq' },
            { text: '🤝 Поддержка', url: 'https://t.me/sanchess08' },
          ],
        ],
      },
    },
  );
}

async function sendWithMenuButton(chatId, text) {
  await bot.sendMessage(chatId, text, {
    parse_mode: 'HTML',
    disable_web_page_preview: true,
    reply_markup: {
      inline_keyboard: [
        [{ text: '↩️ Вернуться в меню', callback_data: 'menu' }],
      ],
    },
  });
}

export const connectBot = () => {
  bot.onText(/\/start|\/menu/, async (msg) => {
    const chatId = msg.chat.id;
    await showMainMenu(chatId);
  });

  bot.on('callback_query', async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;

    if (data === 'menu') {
      await showMainMenu(chatId);
      await bot.answerCallbackQuery(callbackQuery.id);
      return;
    }

    switch (data) {
      case 'rakeback':
        await sendWithMenuButton(
          chatId,
          '<b>Программа лояльности на RedStar</b> состоит из 2 уровней: RED и STAR. Игроки получают рейкбек путём обмена бонусных очков на деньги.\n\n' +
            '• <b>Уровень RED</b>\n' +
            'Начальный уровень для всех игроков RedStar, на котором можно обменивать бонусные очки из расчёта 50 SP на €1 — что даёт <b>20% рейкбека</b>. Вне зависимости от того, сколько рейка вы будете генерировать в течение месяца, вы не потеряете данный уровень.\n\n' +
            '• <b>Уровень STAR</b>\n' +
            'Продвинутый уровень для активных игроков RedStar, на котором есть возможность обменивать бонусные очки из расчёта 29 SP на €1 — что даёт <b>35% рейкбека</b>.',
        );
        break;

      case 'reload':
        await sendWithMenuButton(
          chatId,
          'Игроки, <a href="https://c.rsppartners.com/clickthrgh?btag=a_9631b_75l_9">зарегистрированные на RedStar</a> с промокодом <b>storo08</b>, могут получать релоад-бонусы каждый квартал.\n\n' +
            'Бонусы на <b>5% рейкбека</b> получают все игроки. Бонусы на <b>10% рейкбека</b> получают игроки, которые генерируют $5000+ рейка в месяц.\n\n' +
            'Для получения бонуса <a href="https://t.me/sanchess08">напишите в лс</a>.',
        );
        break;

      case 'leaderboard':
        await sendWithMenuButton(
          chatId,
          '<b>storo08 Leaderboard</b> — это ежемесячная приватная гонка для активных игроков Twister, SNG и MTT, <a href="https://c.rsppartners.com/clickthrgh?btag=a_9631b_75l_9">зарегистрированных на RedStar</a> с промокодом <b>storo08</b>.\n\n' +
            '💰 Призовой фонд: <b>T€6000 в месяц!</b>\n\n' +
            'Баллы игрокам начиляются за участие в любых турнирах на Redstar. Призовые распределяются среди участников, которые смогли войти в TOP100 гонки.\n\n' +
            '🎁 Действует постоянная акция! Помимо основной выплаты за каждые набранные 10М баллов игроки получают дополнительный бонусный <b>билет номиналом €100!</b>\n\n' +
            'Лидерборд, полные правила, распределение призов и другую подробную информацию читайте <a href="https://mshns.github.io/storo08leaderboard/">на странице акции</a>.',
        );
        break;

      case 'chase':
        await sendWithMenuButton(
          chatId,
          '<b>storo08 Race Chase</b> — это специальная акция для активных игроков в покер, <a href="https://c.rsppartners.com/clickthrgh?btag=a_9631b_75l_9">зарегистрированных на RedStar</a> с промокодом <b>storo08</b>, которая позволяет ежемесячно получать дополнительные 5% рейкбека на свой счёт!\n\n' +
            'Неважно, какой вид покера вы предпочитаете. Приватная акция storo08 Race Chase подойдёт игрокам в кэш, MTT и SnG — турниры. Для расчёта Chase выплаты учитывается общая сумма рейка, набранная за месяц во всех покерных играх.\n\n' +
            'Все призы по акции выплачиваются в течение первой недели следующего месяца переводом внутри рума на счёт игрока.\n\n' +
            'Узнать свою chase выплату, полные правила и другую подробную информацию можно <a href="https://mshns.github.io/storo08chase/">на странице акции</a>.',
        );
        break;

      case 'challenge':
        await sendWithMenuButton(
          chatId,
          '<b>storo08 Twister Challenge</b> — это еженедельные челленджи для игроков низких лимитов €1, €2 и €3 твистеров на RedStar!\n\n' +
            'Сыграйте не менее 500 твистеров за неделю на лимите €1, €2 или €3 и получите 3 тикета своего лимита, 900 твистеров — 5 тикетов, 1400 твистеров — 9 тикетов.\n\n' +
            'К участию допускаются только игроки, <a href="https://c.rsppartners.com/clickthrgh?btag=a_9631b_75l_9">зарегистрированных на RedStar</a> с промокодом <b>storo08</b>.\n\n' +
            'Для получения билетов необходимо <a href="https://www.vigorish.ru/section84/topic13467.html">оставить заявку</a>.',
        );
        break;

      case 'freeroll':
        await sendWithMenuButton(
          chatId,
          '<b>storo08 Heads-Up Challenge</b> — это уже ставшие традиционными тренировочные фрироллы в формате хедзап-шутаутов, которые проходят каждую пятницу на RedStar.\n\n' +
            'В каждом фриролле разыгрываются турнирные деньги среди призёров, рандомные призы среди всех участников, а также баунти за выбивание <b>storo08</b>.\n\n' +
            'К участию допускаются только игроки, <a href="https://c.rsppartners.com/clickthrgh?btag=a_9631b_75l_9">зарегистрированных на RedStar</a> с промокодом <b>storo08</b>.\n\n' +
            'Билеты на фрироллы приходят на аккаунт перед турнирами.',
        );
        break;

      case 'register':
        await sendWithMenuButton(
          chatId,
          '📝 <b>Регистрация на RedStar</b>\n\n' +
            '1️⃣ Перейди по ссылке:\n' +
            "<a href='https://c.rsppartners.com/clickthrgh?btag=a_9631b_75l_9'>Регистрация на RedStar</a>\n\n" +
            '2️⃣ Введи промокод: <b>storo08</b>\n\n' +
            '3️⃣ Получи:\n' +
            '• Бонус 200% на первый депозит\n' +
            '• Рейкбек до 60%\n' +
            '• Доступ ко всем приватным акциям\n\n',
        );
        break;

      case 'faq':
        await sendWithMenuButton(
          chatId,
          '❓ <b>Частые вопросы</b>\n\n' +
            '🔹 <b>Можно ли получать бонусы, если регистрация на RedStar уже есть?</b>\n' +
            'Да, есть возможность присоединиться к партнёрской программе storo08. <a href="https://t.me/sanchess08">Напишите в лс</a> для уточнения деталей.\n\n' +
            '🔹 <b>Нужно ли регистрироваться в приватных акциях?</b>\n' +
            'Нет, достаточно <a href="https://c.rsppartners.com/clickthrgh?btag=a_9631b_75l_9">зарегистрироваться на RedStar</a> с промокодом <b>storo08</b> и получить доступ ко всем акциям и бонусам автоматически.\n' +
            'Для получения билетов в акции storo08 Twister Challenge необходимо <a href="https://www.vigorish.ru/section84/topic13467.html">оставить заявку</a>.\n\n' +
            '🔹 <b>Есть поддержка?</b>\n' +
            'Да, <a href="https://t.me/sanchess08">пишите в лс</a> — всегда поможем! 🤝',
        );
        break;
    }

    await bot.answerCallbackQuery(callbackQuery.id);
  });

  console.log('🤖 connected to telegram');
};
