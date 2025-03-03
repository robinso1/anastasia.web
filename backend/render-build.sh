#!/usr/bin/env bash
# exit on error
set -o errexit

# Установка зависимостей
npm install

# Генерация Prisma клиента
npx prisma generate

# Запуск миграций
npx prisma migrate deploy

# Инициализация базы данных
npm run seed

# Сборка приложения
npm run build 