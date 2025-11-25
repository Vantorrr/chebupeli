// Server.js - ОДИН сервер для Next.js и Телеграм бота
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { Telegraf } = require('telegraf')

const dev = process.env.NODE_ENV !== 'production'
const hostname = '0.0.0.0'
const port = parseInt(process.env.PORT || '3000', 10)

// --- НАСТРОЙКА БОТА ---
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const WEBHOOK_DOMAIN = process.env.TELEGRAM_WEBAPP_URL // Используем URL сайта для вебхука
const WEBHOOK_PATH = '/api/bot-webhook' // Специальный путь для вебхука

console.log('🤖 Initializing Bot...');
let bot = null

if (BOT_TOKEN) {
  bot = new Telegraf(BOT_TOKEN)
  
  // Настройка вебхука при старте
  if (WEBHOOK_DOMAIN && !dev) {
    const webhookUrl = `${WEBHOOK_DOMAIN}${WEBHOOK_PATH}`
    console.log(`🔗 Setting webhook to: ${webhookUrl}`)
    bot.telegram.setWebhook(webhookUrl).catch(console.error)
  }

  // --- ЛОГИКА БОТА (копируем из bot/index.js) ---
  // Главное меню
  const { Markup } = require('telegraf');
  const getMainMenu = () => {
    // Убираем слэш в конце, если есть
    const webAppUrl = (process.env.TELEGRAM_WEBAPP_URL || '').replace(/\/$/, '');
    return Markup.keyboard([
      [
        Markup.button.webApp('🌍 Тарифы', `${webAppUrl}`),
        Markup.button.webApp('📲 Мои eSIM', `${webAppUrl}/my-esims`)
      ],
      [
        Markup.button.webApp('🛠 Поддержка', `${webAppUrl}/support`),
        Markup.button.webApp('📄 Правовая информация', `${webAppUrl}/legal`)
      ],
      [
        Markup.button.webApp('🏠 Открыть Velaro', `${webAppUrl}`)
      ]
    ]).resize().persistent();
  };

  bot.start(async (ctx) => {
    try {
      const userName = ctx.from?.first_name || 'пользователь';
      const welcomeText = `🌴 Добро пожаловать в Velaro, ${userName}!\n\n🚀 Цифровые интернет-пакеты для путешествий по всему миру.\n\n✨ Что мы предлагаем:\n• 🌍 200+ стран и регионов\n• ⚡ Мгновенная активация eSIM\n• 💰 Выгодные цены\n• 📱 Поддержка всех устройств\n\nВыберите действие из меню ниже 👇`;
      await ctx.reply(welcomeText, getMainMenu());
    } catch (e) { console.error(e); }
  });

  bot.command('menu', async (ctx) => {
    await ctx.reply('📱 Главное меню Velaro:', getMainMenu());
  });

  // Текстовые кнопки
  bot.hears('🌍 Тарифы', async (ctx) => {
    const webAppUrl = (process.env.TELEGRAM_WEBAPP_URL || '').replace(/\/$/, '');
    await ctx.reply('🌍 Выберите страну и тариф:', {
      reply_markup: { inline_keyboard: [[{ text: '🌍 Открыть каталог тарифов', web_app: { url: `${webAppUrl}` } }]] }
    });
  });

  bot.hears('📲 Мои eSIM', async (ctx) => {
    const webAppUrl = (process.env.TELEGRAM_WEBAPP_URL || '').replace(/\/$/, '');
    await ctx.reply('📲 Ваши eSIM:', {
      reply_markup: { inline_keyboard: [[{ text: '📲 Открыть мои eSIM', web_app: { url: `${webAppUrl}/my-esims` } }]] }
    });
  });

  bot.hears('🛠 Поддержка', async (ctx) => {
    const webAppUrl = (process.env.TELEGRAM_WEBAPP_URL || '').replace(/\/$/, '');
    const supportText = `🛠 Поддержка Velaro\n\nМы всегда готовы помочь!\n\n📞 Свяжитесь с нами:\n• Email: ${process.env.SUPPORT_EMAIL || 'velaroite@gmail.com'}\n• Telegram: @${process.env.SUPPORT_BOT_USERNAME || 'velaro_support'}`;
    await ctx.reply(supportText, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '❓ Открыть FAQ', web_app: { url: `${webAppUrl}/faq` } }],
          [{ text: '💬 Связаться с поддержкой', url: `https://t.me/${process.env.SUPPORT_BOT_USERNAME || 'velaro_support'}` }],
          [{ text: '📧 Написать на email', url: `mailto:${process.env.SUPPORT_EMAIL || 'velaroite@gmail.com'}` }]
        ]
      }
    });
  });

  bot.hears('📄 Правовая информация', async (ctx) => {
    const webAppUrl = (process.env.TELEGRAM_WEBAPP_URL || '').replace(/\/$/, '');
    const legalText = `📄 Правовая информация Velaro\n\nПубличная оферта и политика конфиденциальности.\n\nИспользуя сервис Velaro, вы соглашаетесь с условиями использования.`;
    await ctx.reply(legalText, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '📋 Публичная оферта', web_app: { url: `${webAppUrl}/offer` } }, { text: '🔒 Политика конфиденциальности', web_app: { url: `${webAppUrl}/privacy` } }]
        ]
      }
    });
  });

  bot.hears('🏠 Открыть Velaro', async (ctx) => {
    const webAppUrl = (process.env.TELEGRAM_WEBAPP_URL || '').replace(/\/$/, '');
    await ctx.reply('🏠 Открываю Velaro...', {
      reply_markup: { inline_keyboard: [[{ text: '🚀 Открыть приложение', web_app: { url: `${webAppUrl}` } }]] }
    });
  });

  // Fallback для текста
  bot.on('text', async (ctx) => {
    const text = ctx.message?.text;
    if (!text || text.startsWith('/') || ['🌍 Тарифы', '📲 Мои eSIM', '🛠 Поддержка', '📄 Правовая информация', '🏠 Открыть Velaro'].includes(text)) return;
    await ctx.reply('Выберите действие из меню 👇', getMainMenu());
  });

  // Обработка ошибок
  bot.catch((err) => console.error('Bot error:', err));

} else {
  console.warn('⚠️ TELEGRAM_BOT_TOKEN not set, bot will not run');
}

// --- NEXT.JS SERVER ---
const appNext = next({ dev, hostname, port })
const handle = appNext.getRequestHandler()

console.log(`🚀 Starting Unified Server (Next.js + Bot) on port ${port}...`)

appNext.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      const { pathname } = parsedUrl

      // 1. Обработка вебхука бота
      if (pathname === WEBHOOK_PATH && req.method === 'POST' && bot) {
        let body = ''
        req.on('data', chunk => { body += chunk.toString() })
        req.on('end', async () => {
          try {
            await bot.handleUpdate(JSON.parse(body))
            res.writeHead(200).end('OK')
          } catch (e) {
            console.error('Webhook error:', e)
            res.writeHead(500).end('Error')
          }
        })
        return
      }

      // 2. Health check
      if (pathname === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ status: 'ok', service: 'velaro-unified' }))
        return
      }

      // 3. Все остальные запросы -> в Next.js
      await handle(req, res, parsedUrl)

    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  }).listen(port, hostname, (err) => {
    if (err) throw err
    console.log(`✅ Ready on http://${hostname}:${port}`)
  })
})
