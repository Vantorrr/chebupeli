# Настройка Railway для Velaro

## Шаг 1: Создание сервисов на Railway

### 1.1. Сервис для Next.js Mini App

1. Создайте новый сервис на Railway
2. Подключите GitHub репозиторий
3. Railway автоматически определит Next.js и использует `railway.json` из корня

**Переменные окружения:**
- `MOBIMATTER_MERCHANT_ID` - ваш Merchant ID от MobiMatter
- `MOBIMATTER_API_KEY` - ваш API Key от MobiMatter
- `TARIFF_MARGIN` - маржа (например, `1.0` для 100%)
- `TELEGRAM_WEBAPP_URL` - URL этого сервиса (Railway автоматически создаст, например: `https://velaro-mini-app-production.up.railway.app`)

### 1.2. Сервис для Telegram бота

1. Создайте **отдельный** сервис на Railway
2. Подключите тот же GitHub репозиторий
3. В настройках сервиса укажите:
   - **Root Directory**: `bot`
   - Railway автоматически использует `bot/railway.json`

**Переменные окружения:**
- `TELEGRAM_BOT_TOKEN` - токен бота от @BotFather (например: `8086396950:AAGH20vQTc2SDzTFnsEeKNZL4zmcUy3ewR4`)
- `WEBHOOK_URL` - **публичный URL этого сервиса** (Railway автоматически создаст, например: `https://velaro-bot-production.up.railway.app`)
- `TELEGRAM_WEBAPP_URL` - URL сервиса Next.js (из шага 1.1)
- `SUPPORT_EMAIL` - email поддержки (опционально, по умолчанию: `velaroite@gmail.com`)
- `SUPPORT_BOT_USERNAME` - username бота поддержки (опционально)

## Шаг 2: Получение URL сервисов

После деплоя каждого сервиса:

1. Откройте настройки сервиса
2. Перейдите в "Settings" → "Networking"
3. Нажмите "Generate Domain"
4. Скопируйте публичный URL (например: `https://velaro-bot-production.up.railway.app`)

## Шаг 3: Настройка переменных окружения

### Для сервиса Next.js:
```
MOBIMATTER_MERCHANT_ID=89678614-305d-4ee6-a99b-ece304cbc3fa
MOBIMATTER_API_KEY=ab2b817337b4430ea216d27c1a0aa2c1
TARIFF_MARGIN=1.0
TELEGRAM_WEBAPP_URL=https://velaro-mini-app-production.up.railway.app
```

### Для сервиса бота:
```
TELEGRAM_BOT_TOKEN=8086396950:AAGH20vQTc2SDzTFnsEeKNZL4zmcUy3ewR4
WEBHOOK_URL=https://velaro-bot-production.up.railway.app
TELEGRAM_WEBAPP_URL=https://velaro-mini-app-production.up.railway.app
SUPPORT_EMAIL=velaroite@gmail.com
```

**ВАЖНО:** 
- `WEBHOOK_URL` в сервисе бота должен быть URL **самого сервиса бота**
- `TELEGRAM_WEBAPP_URL` в обоих сервисах должен быть URL **сервиса Next.js**

## Шаг 4: Проверка работы

1. После деплоя обоих сервисов, откройте логи сервиса бота
2. Должно появиться сообщение: `✅ Webhook установлен: https://velaro-bot-production.up.railway.app/webhook`
3. Откройте Telegram и отправьте боту `/start`
4. Бот должен ответить и показать меню

## Шаг 5: Настройка Mini App в Telegram

1. Откройте @BotFather в Telegram
2. Отправьте `/mybots`
3. Выберите вашего бота
4. Выберите "Bot Settings" → "Menu Button"
5. Выберите "Configure Menu Button"
6. Укажите:
   - **Text**: `Открыть Velaro`
   - **URL**: URL вашего Next.js сервиса (например: `https://velaro-mini-app-production.up.railway.app`)

## Troubleshooting

### Бот не отвечает
- Проверьте логи сервиса бота на Railway
- Убедитесь, что `WEBHOOK_URL` правильный
- Проверьте, что `TELEGRAM_BOT_TOKEN` правильный
- Убедитесь, что сервис бота запущен и доступен

### Webhook не устанавливается
- Проверьте, что `WEBHOOK_URL` доступен извне (не localhost)
- Убедитесь, что сервис бота имеет публичный домен
- Проверьте логи на наличие ошибок

### Mini App не открывается
- Проверьте, что `TELEGRAM_WEBAPP_URL` правильный
- Убедитесь, что Next.js сервис запущен
- Проверьте логи Next.js сервиса

