Чтобы запустить backend
```
cd ~/RGZ_WEB/video-platform/backend
source venv/bin/activate
lsof -ti:8000 | xargs kill -9
python manage.py runserver
```

Для запуска frontend
```
cd ~/RGZ_WEB/video-platform/frontend
npm start
```

ВАЖНО: БЭК ЗАПУСКАТЬ В ОДНОМ ТЕРМИНАЛЕ, А ФРОНТ ПАРАЛЛЕЛЬНО В СЛЕДУЮЩЕМ ТЕРМИНАЛЕ
