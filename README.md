# Видеохостинг

Веб-приложение для просмотра, загрузки и управления видеоконтентом. Аналог YouTube с базовым функционалом.

## Технологии

Бэкенд: Django 5.0, Django REST Framework (DRF), JWT аутентификация, SQLite (по умолчанию) / PostgreSQL, Django CORS Headers.

Фронтенд: React 18, Tailwind CSS, React Router DOM, Axios, React Icons, React Hot Toast.

## Установка и запуск

Требования: Python 3.10+, Node.js 18+, npm или yarn.

Настройка бэкенда:
```
cd backend
python -m venv venv
source venv/bin/activate  # Для Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Настройка фронтенда:
```
cd frontend
npm install
npm start
```

Доступ к приложению:

Фронтенд: http://localhost:3000

Бэкенд API: http://localhost:8000/api/

Админ-панель: http://localhost:8000/admin/


## Структура проекта
```
video-platform/
├── backend/                 # Django бэкенд
│   ├── backend/            # Основные настройки
│   ├── users/              # Приложение пользователей
│   ├── videos/             # Приложение видео
│   ├── media/              # Загруженные файлы
│   └── db.sqlite3          # База данных
├── frontend/               # React фронтенд
│   ├── public/             # Статические файлы
│   ├── src/
│   │   ├── components/     # React компоненты
│   │   ├── contexts/       # Context API
│   │   ├── pages/          # Страницы
│   │   └── App.js          # Главный компонент
└── README.md
```
## Функционал

Пользователи: регистрация и авторизация (JWT), профиль пользователя (аватар, баннер, биография, местоположение, сайт, дата рождения), подписка на каналы.

Видео: просмотр видео с кастомным плеером, загрузка видео (MP4), добавление превью (thumbnail), лайки, комментарии с возможностью удаления, подсчет просмотров, удаление своих видео.

Поиск: поиск по названию и описанию видео, работает на всех вкладках, сохраняется в URL.

Страницы: главная (рекомендации и новые видео), подписки (видео от подписанных каналов), профиль пользователя, страница видео, загрузка видео.

## API Эндпоинты
```
Пользователи (api/users/):
POST /register/ - Регистрация
POST /login/ - Вход (JWT)
POST /refresh/ - Обновление токена
GET /me/ - Текущий пользователь
GET / - Список пользователей
POST /{id}/subscribe/ - Подписка/отписка
PATCH /{id}/update-profile/ - Обновление профиля
POST /{id}/upload-avatar/ - Загрузка аватара
POST /{id}/upload-banner/ - Загрузка баннера

Видео (api/videos/):
GET / - Список видео
GET /recommended/- Рекомендации
GET /subscriptions/ - Видео из подписок
POST / - Загрузка видео
GET /{id}/ - Детали видео
POST /{id}/like/ - Лайк/дизлайк
POST /{id}/view/ - Увеличение просмотра
GET /{id}/comments/ - Комментарии
POST /{id}/comments/ - Добавить комментарий
DELETE /{id}/comments/ - Удалить комментарий
DELETE /{id}/ - Удалить видео
```
## Дизайн

Цветовая схема из Figma:

Основной цвет: #8B5CF6 (Purple)
Акцентный цвет: #EC4899 (Pink)
Фон: #0F0F0F (Black)
Карточки: #1A1A1A
Текст основной: #FFFFFF
Текст второстепенный: #A1A1AA

## Решение проблем

Ошибка Module not found:
```
cd frontend
rm -rf node_modules package-lock.json
npm install
```

Порт уже используется:
```
lsof -ti:8000 | xargs kill -9  # Убить бэкенд
lsof -ti:3000 | xargs kill -9  # Убить фронтенд
```

Ошибка CORS: убедитесь, что в backend/settings.py есть CORS_ALLOW_ALL_ORIGINS = True
