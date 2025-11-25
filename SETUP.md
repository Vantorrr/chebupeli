# Инструкция по запуску Velaro

## Быстрый старт

### 1. Установка зависимостей

```bash
# В корневой директории
npm install

# В директории app
cd app
npm install
cd ..
```

### 2. Настройка переменных окружения

Создайте файл `.env` в корневой директории:

```bash
cp .env.example .env
```

Заполните обязательные переменные:
- `TELEGRAM_BOT_TOKEN` - получите у @BotFather в Telegram
- `TELEGRAM_WEBAPP_URL` - URL вашего Mini App (для разработки можно использовать ngrok)

Создайте файл `app/.env.local`:

```bash
cd app
cp .env.local.example .env.local
```

### 3. Создание Telegram бота

1. Откройте Telegram и найдите @BotFather
2. Отправьте команду `/newbot`
3. Следуйте инструкциям и получите токен бота
4. Вставьте токен в `.env` как `TELEGRAM_BOT_TOKEN`

### 4. Настройка Mini App

1. После создания бота, отправьте @BotFather команду `/newapp`
2. Выберите вашего бота
3. Укажите название приложения: `Velaro`
4. Укажите описание: `Цифровые интернет-пакеты для путешествий`
5. Загрузите фото (можно использовать логотип)
6. Укажите URL вашего Mini App (например, `https://your-domain.com`)

### 5. Запуск для разработки

**Вариант 1: Локально с ngrok**

```bash
# Терминал 1: Запуск Mini App
cd app
npm run dev

# Терминал 2: Запуск ngrok (установите ngrok: https://ngrok.com/)
ngrok http 3000

# Терминал 3: Запуск бота
npm run dev:bot
```

Скопируйте HTTPS URL из ngrok и укажите его в `.env` как `TELEGRAM_WEBAPP_URL`

**Вариант 2: С помощью concurrently**

```bash
npm run dev
```

Это запустит и бота, и Mini App одновременно.

### 6. Проверка работы

1. Откройте Telegram
2. Найдите вашего бота
3. Отправьте команду `/start`
4. Нажмите на кнопку "Тарифы" - должно открыться Mini App

## Настройка платежных систем

### Тинькофф

1. Зарегистрируйтесь в Тинькофф Бизнес
2. Получите Terminal Key и Password
3. Добавьте в `.env`:
   ```
   TINKOFF_TERMINAL_KEY=your_terminal_key
   TINKOFF_PASSWORD=your_password
   ```

### ЮKassa

1. Зарегистрируйтесь в ЮKassa
2. Получите Shop ID и Secret Key
3. Добавьте в `.env`:
   ```
   YOOKASSA_SHOP_ID=your_shop_id
   YOOKASSA_SECRET_KEY=your_secret_key
   ```

### CloudPayments

1. Зарегистрируйтесь в CloudPayments
2. Получите Public ID и Secret Key
3. Добавьте в `.env`:
   ```
   CLOUDPAYMENTS_PUBLIC_ID=your_public_id
   CLOUDPAYMENTS_SECRET_KEY=your_secret_key
   ```

## Интеграция с MobiMatter API

Проект интегрирован с [MobiMatter API](https://docs.mobimatter.com/docs/intro) для получения тарифов и создания заказов eSIM.

### Настройка MobiMatter

1. Зарегистрируйтесь на [Partner Portal MobiMatter](https://partner.mobimatter.com)
2. Получите доступ к API Dashboard
3. Скопируйте ваш **Merchant ID** и **Primary API Key**
4. Добавьте в `app/.env.local`:
   ```
   MOBIMATTER_MERCHANT_ID=your_merchant_id
   MOBIMATTER_API_KEY=your_api_key
   TARIFF_MARGIN=1.0
   ```
   Где `TARIFF_MARGIN` - маржа в процентах (1.0 = 100%, 0.5 = 50%)

### Как работает интеграция

- **Получение тарифов**: API автоматически загружает продукты из MobiMatter и применяет маржу
- **Создание заказов**: Заказы создаются через MobiMatter API, оплата происходит автоматически через кошелек
- **Получение eSIM**: После создания заказа автоматически получаются QR-код и активационные данные

### Fallback режим

Если MobiMatter API недоступен, приложение автоматически переключается на моковые данные для разработки.

### Пополнение кошелька

Кошелек MobiMatter можно пополнить через Partner Portal или банковским переводом. Все заказы оплачиваются автоматически из кошелька.

## Деплой

### Mini App (Vercel)

```bash
cd app
npm run build
vercel deploy
```

### Бот (Heroku / Railway / VPS)

```bash
npm start
```

Убедитесь, что:
- Переменные окружения настроены
- `TELEGRAM_WEBAPP_URL` указывает на деплой Mini App
- Порт доступен для Telegram

## Структура проекта

```
velaro/
├── bot/              # Telegram бот
│   └── index.js
├── app/              # Next.js Mini App
│   ├── app/          # Страницы (App Router)
│   ├── components/   # React компоненты
│   ├── pages/        # API routes
│   └── public/       # Статические файлы
├── .env              # Переменные окружения
└── package.json
```

## Полезные команды

```bash
# Разработка
npm run dev              # Запуск бота и Mini App
npm run dev:bot          # Только бот
npm run dev:app          # Только Mini App

# Продакшн
npm run build            # Сборка Mini App
npm start                # Запуск бота
```

## Поддержка

Email: velaroite@gmail.com

