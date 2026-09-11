#!/bin/bash

# Скрипт для запуска фронтенда и бэкенда одновременно
# Автор: Helpdesk Project
# Дата: 4 ноября 2025

echo "🚀 Запускаем Helpdesk приложение..."
echo "=================================="

# Функция для остановки процессов при выходе
cleanup() {
    echo ""
    echo "🛑 Останавливаем серверы..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

# Ловим сигналы для корректного завершения
trap cleanup SIGINT SIGTERM

# Проверяем что мы в правильной директории
if [ ! -d "help-desk_backend-main" ] || [ ! -d "help-desk_frontend-main" ]; then
    echo "❌ Ошибка: Не найдены директории проекта"
    echo "   Убедитесь что скрипт запущен из корневой директории проекта"
    exit 1
fi

# Запускаем бэкенд
echo "🔧 Запускаем Django бэкенд на http://127.0.0.1:8000..."
cd help-desk_backend-main
python3 manage.py runserver 127.0.0.1:8000 &
BACKEND_PID=$!
cd ..

# Ждем чтобы бэкенд успел запуститься
sleep 3

# Проверяем что бэкенд запустился
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "❌ Ошибка: Не удалось запустить бэкенд"
    exit 1
fi

# Запускаем фронтенд
echo "⚛️  Запускаем React фронтенд на http://localhost:3000..."
cd help-desk_frontend-main

# Проверяем что node_modules установлены
if [ ! -d "node_modules" ]; then
    echo "📦 Устанавливаем зависимости npm..."
    npm install
fi

# Устанавливаем переменную окружения для API
export REACT_APP_API_URL=http://127.0.0.1:8000

npm start &
FRONTEND_PID=$!
cd ..

# Ждем чтобы фронтенд успел запуститься
sleep 5

# Проверяем что фронтенд запустился
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    echo "❌ Ошибка: Не удалось запустить фронтенд"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo ""
echo "✅ Серверы успешно запущены!"
echo "=================================="
echo "🔧 Бэкенд (Django):  http://127.0.0.1:8000"
echo "⚛️  Фронтенд (React): http://localhost:3000"
echo ""
echo "📝 Полезные URL:"
echo "   - API документация: http://127.0.0.1:8000/admin/"
echo "   - Заявки API:       http://127.0.0.1:8000/app/"
echo "   - Веб приложение:   http://localhost:3000"
echo ""
echo "⌨️  Нажмите Ctrl+C для остановки серверов"
echo "=================================="

# Ждем сигнала завершения
wait $BACKEND_PID $FRONTEND_PID