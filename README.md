# 📺 Видеоплатформа

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

Современное веб-приложение для обмена видеоконтентом, вдохновленное функционалом YouTube. Позволяет пользователям загружать видео, подписываться на каналы и взаимодействовать с контентом в реальном времени.


##  Основные возможности

### 👤 Пользователи
* **Аутентификация:** Безопасный вход через JWT (JSON Web Tokens).
* **Профили:** Настройка аватара, баннера, биографии и личных данных.
* **Социальное взаимодействие:** Система подписок на интересующие каналы.

### 🎬 Видео и Контент
* **Загрузка:** Поддержка MP4 и кастомных превью (thumbnails).
* **Плеер:** Собственный видеоплеер для комфортного просмотра.
* **Реакции:** Система лайков и интерактивные комментарии.
* **Аналитика:** Автоматический подсчет просмотров.

### 🔍 Поиск и Навигация
* **Умный поиск:** Поиск по названиям и описаниям с сохранением состояния в URL.
* **Ленты:** Умные рекомендации, новинки и раздел с подписками.


## 🛠 Технологический стек

| Слой | Технологии |
| :--- | :--- |
| **Frontend** | React 18, Tailwind CSS, Axios, React Router DOM, React Hot Toast |
| **Backend** | Django 5.0, Django REST Framework (DRF) |
| **Безопасность** | JWT Authentication, Django CORS Headers |
| **База данных** | SQLite (dev) / PostgreSQL (prod) |


## 📂 Структура проекта
```text
video-platform/
├── backend/             # Django API сервер
│   ├── users/           # Управление аккаунтами и профилями
│   ├── videos/          # Логика работы с контентом
│   └── media/           # Хранилище видео и изображений
├── frontend/            # React SPA приложение
│   ├── src/components/  # Переиспользуемые UI элементы
│   ├── src/contexts/    # Управление глобальным состоянием
│   └── src/pages/       # Маршрутизация и страницы
└── README.md
```


## Быстрый старт

### Требования
* Python 3.10+
* Node.js 18+

### 1. Настройка Бэкенда
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### 2. Настройка Фронтенда
```bash
cd frontend
npm install
npm start
```

**Доступ по адресам:**
* Frontend: `http://localhost:3000`
* API Root: `http://localhost:8000/api/`
* Admin Panel: `http://localhost:8000/admin/`


## API Эндпоинты (Кратко)

### Видео
* `GET /api/videos/` — Список всех видео
* `POST /api/videos/` — Загрузка нового контента
* `POST /api/videos/{id}/like/` — Управление лайками

### Пользователи
* `POST /api/users/register/` — Регистрация
* `GET /api/users/me/` — Данные текущего пользователя
* `PATCH /api/users/{id}/update-profile/` — Редактирование профиля



## 🛠 Решение проблем

**Ошибка "Module not found":**
Попробуйте переустановить зависимости:
```bash
cd frontend && rm -rf node_modules package-lock.json && npm install
```

**Если порты (3000/8000) заняты:**
```bash
lsof -ti:8000 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```
