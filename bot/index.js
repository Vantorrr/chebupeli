const { Telegraf, Markup } = require('telegraf');
const express = require('express');
require('dotenv').config();

const app = express();
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || '8086396950:AAGH20vQTc2SDzTFnsEeKNZL4zmcUy3ewR4');

// Middleware для логирования
bot.use(async (ctx, next) => {
  try {
    console.log(`[${new Date().toISOString()}] ${ctx.updateType} from ${ctx.from?.id}`);
    return await next();
  } catch (err) {
    console.error('Ошибка в middleware:', err);
    throw err;
  }
});

// Функция для создания главного меню
const getMainMenu = () => {
  const webAppUrl = process.env.TELEGRAM_WEBAPP_URL || 'https://velaro-mini-app-production.up.railway.app';
  
  return Markup.keyboard([
    [
      Markup.button.webApp('🌍 Тарифы', `${webAppUrl}/`),
      Markup.button.webApp('📲 Мои eSIM', `${webAppUrl}/my-esims`)
    ],
    [
      Markup.button.webApp('🛠 Поддержка', `${webAppUrl}/support`),
      Markup.button.webApp('📄 Правовая информация', `${webAppUrl}/legal`)
    ],
    [
      Markup.button.webApp('🏠 Открыть Velaro', `${webAppUrl}/`)
    ]
  ]).resize().persistent();
};

// Команда /start
bot.start(async (ctx) => {
  try {
    const userName = ctx.from?.first_name || 'пользователь';
    
    const welcomeText = `🌴 Добро пожаловать в Velaro, ${userName}!

🚀 Цифровые интернет-пакеты для путешествий по всему миру.

✨ Что мы предлагаем:
• 🌍 200+ стран и регионов
• ⚡ Мгновенная активация eSIM
• 💰 Выгодные цены
• 📱 Поддержка всех устройств

Выберите действие из меню ниже 👇`;

    await ctx.reply(welcomeText, getMainMenu());
  } catch (err) {
    console.error('Ошибка в /start:', err);
    try {
      await ctx.reply('Добро пожаловать в Velaro! Используйте /menu для навигации.', getMainMenu());
    } catch (e) {
      console.error('Критическая ошибка в /start:', e);
    }
  }
});

// Команда /menu
bot.command('menu', async (ctx) => {
  try {
    await ctx.reply('📱 Главное меню Velaro:', getMainMenu());
  } catch (err) {
    console.error('Ошибка в /menu:', err);
    try {
      await ctx.reply('📱 Главное меню:', getMainMenu());
    } catch (e) {
      console.error('Критическая ошибка в /menu:', e);
    }
  }
});

// Обработка текстовых команд
bot.hears('🌍 Тарифы', async (ctx) => {
  try {
    const webAppUrl = process.env.TELEGRAM_WEBAPP_URL || 'https://velaro-mini-app-production.up.railway.app';
    await ctx.reply('🌍 Выберите страну и тариф:', {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🌍 Открыть каталог тарифов', web_app: { url: `${webAppUrl}/` } }
          ]
        ]
      }
    });
  } catch (err) {
    console.error('Ошибка в обработчике "🌍 Тарифы":', err);
    try {
      await ctx.reply('Произошла ошибка. Попробуйте позже или используйте /menu', getMainMenu());
    } catch (e) {
      console.error('Критическая ошибка:', e);
    }
  }
});

bot.hears('📲 Мои eSIM', async (ctx) => {
  try {
    const webAppUrl = process.env.TELEGRAM_WEBAPP_URL || 'https://velaro-mini-app-production.up.railway.app';
    await ctx.reply('📲 Ваши eSIM:', {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '📲 Открыть мои eSIM', web_app: { url: `${webAppUrl}/my-esims` } }
          ]
        ]
      }
    });
  } catch (err) {
    console.error('Ошибка в обработчике "📲 Мои eSIM":', err);
    try {
      await ctx.reply('Произошла ошибка. Попробуйте позже или используйте /menu', getMainMenu());
    } catch (e) {
      console.error('Критическая ошибка:', e);
    }
  }
});

bot.hears('🛠 Поддержка', async (ctx) => {
  try {
    const webAppUrl = process.env.TELEGRAM_WEBAPP_URL || 'https://velaro-mini-app-production.up.railway.app';
    const supportText = `🛠 Поддержка Velaro

Мы всегда готовы помочь!

📞 Свяжитесь с нами:
• Email: ${process.env.SUPPORT_EMAIL || 'velaroite@gmail.com'}
• Telegram: @${process.env.SUPPORT_BOT_USERNAME || 'velaro_support'}

❓ Частые вопросы:
• Проблема с оплатой
• Ошибка при установке eSIM
• Возврат средств`;

    await ctx.reply(supportText, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '❓ Открыть FAQ', web_app: { url: `${webAppUrl}/faq` } }
          ],
          [
            { text: '💬 Связаться с поддержкой', url: `https://t.me/${process.env.SUPPORT_BOT_USERNAME || 'velaro_support'}` }
          ],
          [
            { text: '📧 Написать на email', url: `mailto:${process.env.SUPPORT_EMAIL || 'velaroite@gmail.com'}` }
          ]
        ]
      }
    });
  } catch (err) {
    console.error('Ошибка в обработчике "🛠 Поддержка":', err);
    try {
      await ctx.reply('Произошла ошибка. Попробуйте позже или используйте /menu', getMainMenu());
    } catch (e) {
      console.error('Критическая ошибка:', e);
    }
  }
});

bot.hears('📄 Правовая информация', async (ctx) => {
  try {
    const webAppUrl = process.env.TELEGRAM_WEBAPP_URL || 'https://velaro-mini-app-production.up.railway.app';
    const legalText = `📄 Правовая информация Velaro

Публичная оферта и политика конфиденциальности.

Используя сервис Velaro, вы соглашаетесь с условиями использования.`;

    await ctx.reply(legalText, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '📋 Публичная оферта', web_app: { url: `${webAppUrl}/offer` } },
            { text: '🔒 Политика конфиденциальности', web_app: { url: `${webAppUrl}/privacy` } }
          ]
        ]
      }
    });
  } catch (err) {
    console.error('Ошибка в обработчике "📄 Правовая информация":', err);
    try {
      await ctx.reply('Произошла ошибка. Попробуйте позже или используйте /menu', getMainMenu());
    } catch (e) {
      console.error('Критическая ошибка:', e);
    }
  }
});

bot.hears('🏠 Открыть Velaro', async (ctx) => {
  try {
    const webAppUrl = process.env.TELEGRAM_WEBAPP_URL || 'https://velaro-mini-app-production.up.railway.app';
    await ctx.reply('🏠 Открываю Velaro...', {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🚀 Открыть приложение', web_app: { url: `${webAppUrl}/` } }
          ]
        ]
      }
    });
  } catch (err) {
    console.error('Ошибка в обработчике "🏠 Открыть Velaro":', err);
    try {
      await ctx.reply('Произошла ошибка. Попробуйте позже или используйте /menu', getMainMenu());
    } catch (e) {
      console.error('Критическая ошибка:', e);
    }
  }
});

// Обработка callback для поддержки
bot.action('support', async (ctx) => {
  try {
    const webAppUrl = process.env.TELEGRAM_WEBAPP_URL || 'https://velaro-mini-app-production.up.railway.app';
    const supportText = `🛠 Поддержка Velaro

Свяжитесь с нами:
• Email: ${process.env.SUPPORT_EMAIL || 'velaroite@gmail.com'}
• Telegram: @${process.env.SUPPORT_BOT_USERNAME || 'velaro_support'}

Быстрые решения:
• Проблема с оплатой
• Ошибка при установке eSIM
• Возврат средств`;

    await ctx.editMessageText(supportText, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '❓ FAQ', web_app: { url: `${webAppUrl}/faq` } }
          ],
          [
            { text: '💬 Связаться с поддержкой', url: `https://t.me/${process.env.SUPPORT_BOT_USERNAME || 'velaro_support'}` }
          ],
          [
            { text: '◀️ Назад', callback_data: 'back_to_menu' }
          ]
        ]
      }
    });
  } catch (err) {
    console.error('Ошибка в обработчике callback "support":', err);
    try {
      await ctx.reply('Произошла ошибка. Попробуйте позже или используйте /menu', getMainMenu());
    } catch (e) {
      console.error('Критическая ошибка:', e);
    }
  }
});

// Правовая информация
bot.action('legal', async (ctx) => {
  try {
    const webAppUrl = process.env.TELEGRAM_WEBAPP_URL || 'https://velaro-mini-app-production.up.railway.app';
    const legalText = `📄 Правовая информация

Публичная оферта и политика конфиденциальности Velaro.

Используя сервис Velaro, вы соглашаетесь с условиями использования.`;

    await ctx.editMessageText(legalText, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '📋 Публичная оферта', web_app: { url: `${webAppUrl}/offer` } },
            { text: '🔒 Политика конфиденциальности', web_app: { url: `${webAppUrl}/privacy` } }
          ],
          [
            { text: '◀️ Назад', callback_data: 'back_to_menu' }
          ]
        ]
      }
    });
  } catch (err) {
    console.error('Ошибка в обработчике callback "legal":', err);
    try {
      await ctx.reply('Произошла ошибка. Попробуйте позже или используйте /menu', getMainMenu());
    } catch (e) {
      console.error('Критическая ошибка:', e);
    }
  }
});

// Возврат в меню
bot.action('back_to_menu', async (ctx) => {
  try {
    await ctx.editMessageText('📱 Главное меню Velaro:', getMainMenu());
  } catch (err) {
    console.error('Ошибка в обработчике callback "back_to_menu":', err);
    try {
      await ctx.reply('📱 Главное меню Velaro:', getMainMenu());
    } catch (e) {
      console.error('Критическая ошибка:', e);
    }
  }
});

// Обработка неизвестных текстовых сообщений (должен быть последним)
// В Telegraf обработчики выполняются в порядке регистрации
// bot.hears() имеет приоритет, но bot.on('text') все равно может сработать
// Поэтому мы просто пропускаем известные команды и кнопки
bot.on('text', async (ctx) => {
  try {
    const text = ctx.message?.text;
    if (!text) return;
    
    // Пропускаем команды (они обрабатываются через bot.command)
    if (text.startsWith('/')) return;
    
    // Пропускаем кнопки меню (они обрабатываются через bot.hears)
    const menuButtons = ['🌍 Тарифы', '📲 Мои eSIM', '🛠 Поддержка', '📄 Правовая информация', '🏠 Открыть Velaro'];
    if (menuButtons.includes(text)) {
      // Это сообщение должно было быть обработано bot.hears()
      // Если мы здесь, значит что-то пошло не так, но не обрабатываем повторно
      return;
    }
    
    // Для всех остальных текстовых сообщений показываем меню
    await ctx.reply('Выберите действие из меню 👇', getMainMenu());
  } catch (err) {
    console.error('Ошибка обработки текста:', err);
    try {
      await ctx.reply('Произошла ошибка. Используйте /menu', getMainMenu());
    } catch (e) {
      console.error('Критическая ошибка:', e);
    }
  }
});

// Обработка ошибок
bot.catch(async (err, ctx) => {
  console.error('Ошибка в боте:', err);
  console.error('Stack:', err.stack);
  console.error('Context:', {
    updateType: ctx?.updateType,
    from: ctx?.from?.id,
    chat: ctx?.chat?.id,
    message: ctx?.message?.text
  });
  
  try {
    if (ctx && ctx.reply) {
      await ctx.reply('Произошла ошибка. Попробуйте позже или используйте /menu', getMainMenu());
    }
  } catch (e) {
    console.error('Не удалось отправить сообщение об ошибке:', e);
  }
});

// Настройка вебхука или polling
const PORT = process.env.PORT || 8080;
const WEBHOOK_URL = process.env.WEBHOOK_URL; // Например: https://your-domain.com/webhook

// Если указан WEBHOOK_URL, используем вебхук, иначе polling
if (WEBHOOK_URL) {
  // Настройка вебхука
  app.use(express.json());
  
  app.post('/webhook', async (req, res) => {
    try {
      await bot.handleUpdate(req.body);
      res.sendStatus(200);
    } catch (err) {
      console.error('Ошибка обработки webhook:', err);
      res.sendStatus(200); // Все равно возвращаем 200, чтобы Telegram не повторял запрос
    }
  });
  
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', bot: 'running' });
  });
  
  bot.telegram.setWebhook(WEBHOOK_URL + '/webhook').then(() => {
    console.log('✅ Webhook установлен:', WEBHOOK_URL + '/webhook');
  }).catch(err => {
    console.error('❌ Ошибка установки webhook:', err);
  });
  
  app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
    console.log(`📡 Webhook: ${WEBHOOK_URL}/webhook`);
  });
} else {
  // Используем polling (для разработки)
  bot.launch().then(() => {
    console.log('🤖 Telegram бот Velaro запущен (polling mode)!');
    console.log(`📱 Mini App URL: ${process.env.TELEGRAM_WEBAPP_URL || 'https://velaro-mini-app-production.up.railway.app'}`);
  }).catch(err => {
    console.error('❌ Ошибка запуска бота:', err);
    process.exit(1);
  });
}

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
