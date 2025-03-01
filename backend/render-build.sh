#!/usr/bin/env bash
# exit on error
set -o errexit

# Установка зависимостей
npm install

# Генерация Prisma клиента
npx prisma generate

# Запуск миграций
npx prisma migrate deploy

# Сборка приложения
npm run build

# Инициализация базы данных
npm run seed 