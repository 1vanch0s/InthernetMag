# InthernetMag - Интернет-магазин

**InthernetMag** — это интернет-магазин, разработанный с использованием React на фронтенде и Node.js/Express на бэкенде. Проект позволяет просматривать товары, добавлять их в корзину и оформлять заказы через Stripe. База данных PostgreSQL хранит информацию о товарах, заказах и пользователях.

## Основные функции
- Просмотр каталога товаров с фильтрацией по категории, цене и сортировкой.
- Добавление товаров в корзину с главной страницы и страницы товара.
- Оформление заказа через Stripe с поддержкой тестовых платежей.
- Регистрация и авторизация пользователей.
- Email-уведомления о подтверждении заказа.
- Админ-панель для управления товарами.

## Требования
Для запуска проекта необходимо установить следующие зависимости и сервисы:

### Общие
- **Node.js**: v16 или выше
- **npm**: v8 или выше
- **PostgreSQL**: v13 или выше
- **Git**: для клонирования репозитория

### Бэкенд (зависимости)
Указаны в `backend/package.json`:
- `express`: ^4.17.1
- `pg`: ^8.7.3
- `jsonwebtoken`: ^8.5.1
- `bcrypt`: ^5.0.1
- `stripe`: ^9.11.0
- `nodemailer`: ^6.7.5
- `dotenv`: ^16.0.0
- `cors`: ^2.8.5

### Фронтенд (зависимости)
Указаны в `frontend/package.json`:
- `react`: ^18.2.0
- `react-dom`: ^18.2.0
- `react-router-dom`: ^6.3.0
- `axios`: ^0.27.2
- `@stripe/stripe-js`: ^1.32.0
- `eslint`: ^8.15.0 (опционально, для линтинга)

### Сервисы
- **Stripe**: Аккаунт для получения `STRIPE_SECRET_KEY` и `STRIPE_PUBLIC_KEY`.
- **Email-сервис**: SMTP-сервер (например, Gmail) для Nodemailer (`EMAIL_USER`, `EMAIL_PASS`).

## Установка и запуск

### 1. Клонирование репозитория
```bash
git clone https://github.com/1vanch0s/InthernetMag
cd InthernetMag
```

### 2. Настройка базы данных (PostgreSQL)
1. Установите PostgreSQL, если ещё не установлен.
2. Создайте базу данных:
   ```sql
   createdb onlinemag
   ```
3. Создайте таблицы, выполнив SQL-скрипт `backend/database.sql`:
   ```bash
   psql -U your_username -d inthernetmag -f backend/database.sql
   ```
   Замените `your_username` на вашего пользователя PostgreSQL.
4. Добавьте тестовые данные:
   ```sql
   INSERT INTO products (name, price, category, image_url, description, created_at) VALUES
     ('Test Product 1', 1000.00, 'Electronics', 'https://via.placeholder.com/150', 'Description 1', NOW()),
     ('Test Product 2', 1500.00, 'Clothing', 'https://via.placeholder.com/150', 'Description 2', NOW());
   ```

### 3. Настройка бэкенда
1. Перейдите в папку `backend`:
   ```bash
   cd backend
   ```
2. Установите зависимости:
   ```bash
   npm install
   ```
3. Создайте файл `.env` в папке `backend` и добавьте следующие переменные:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=inthernetmag
   JWT_SECRET=your_very_secure_secret_12345
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   ```
   - Замените `your_username`, `your_password` на данные для PostgreSQL.
   - Получите `STRIPE_SECRET_KEY` в [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys).
4. Запустите бэкенд:
   ```bash
   node server.js
   ```
   Сервер запустится на `http://localhost:5000`.

### 4. Настройка фронтенда
1. Перейдите в папку `frontend`:
   ```bash
   cd frontend
   ```
2. Установите зависимости:
   ```bash
   npm install
   ```
3. Создайте файл `.env` в папке `frontend` (опционально, если нужны кастомные настройки):
   ```env
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
   ```
   - Получите `REACT_APP_STRIPE_PUBLIC_KEY` в [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys).
4. Запустите фронтенд:
   ```bash
   npm start
   ```
   Приложение откроется на `http://localhost:3000`.

### 5. Тестирование оплаты через Stripe
1. Перейдите на `http://localhost:3000/` и войдите в аккаунт (или зарегистрируйтесь).
2. Добавьте товары в корзину.
3. Перейдите на `/checkout` и используйте тестовую карту Stripe:
   - **Номер**: `4242 4242 4242 4242`
   - **Срок**: `12/34`
   - **CVC**: `123`
   - **Имя**: Любое
4. После успешной оплаты вы будете перенаправлены на `/checkout/success`, и на email придёт уведомление.

## Проблемы и отладка
- **Бэкенд не подключается к базе данных**:
  - Проверьте настройки в `backend/.env` (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`).
  - Убедитесь, что PostgreSQL запущен: `pg_isready`.
- **Ошибка Stripe**:
  - Проверьте `STRIPE_SECRET_KEY` и `REACT_APP_STRIPE_PUBLIC_KEY`.
  - Логи: `backend/logs` или консоль бэкенда.
- **Email не отправляется**:
  - Проверьте `EMAIL_USER`, `EMAIL_PASS` в `backend/.env`.
  - Убедитесь, что SMTP-сервер работает (например, включён "Less secure apps" или App Password для Gmail).
- **Фронтенд не загружает товары**:
  - Проверьте Network в DevTools → запросы к `/api/products`.
  - Убедитесь, что бэкенд запущен на `http://localhost:5000`.

## Структура проекта
```
InthernetMag/
├── backend/
│   ├── routes/
│   ├── database.sql
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.js
│   └── package.json
└── README.md
```

## Контакты
Если у вас есть вопросы или предложения, свяжитесь со мной:
- GitHub: [1vanch0s](https://github.com/1vanch0s)
- Email: your_email@example.com (укажите ваш email, если хотите)

## Лицензия
Проект распространяется под лицензией MIT.
